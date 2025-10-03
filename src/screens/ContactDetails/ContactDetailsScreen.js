import React, {useState, useCallback} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Alert,
    Linking,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useContacts} from '../../utils/ContactContext';
import CustomButton from '../../components/common/CustomButton';
import {Colors, Fonts, Spacing, GlobalStyles} from '../../styles/globalStyles';
import {formatContactName} from '../../data/contactsData';

const ContactDetailsScreen = ({navigation, route}) => {
    const {contacts, deleteContact, toggleFavorite} = useContacts();
    const {contactId} = route.params;
    
    const contact = contacts.find(c => c.id === contactId);
    
    const handleCall = useCallback(() => {
        const url = `tel:${contact?.phone}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Phone calls are not supported on this device');
            }
        });
    }, [contact?.phone]);

    const handleMessage = useCallback(() => {
        const url = `sms:${contact?.phone}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'SMS is not supported on this device');
            }
        });
    }, [contact?.phone]);

    const handleEmail = useCallback(() => {
        const url = `mailto:${contact?.email}`;
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Email is not supported on this device');
            }
        });
    }, [contact?.email]);

    const handleDelete = useCallback(() => {
        Alert.alert(
            'Delete Contact',
            `Are you sure you want to delete ${contact?.firstName} ${contact?.lastName}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteContact(contactId);
                        navigation.goBack();
                    }
                },
            ]
        );
    }, [contactId, contact?.firstName, contact?.lastName, deleteContact, navigation]);

    const handleEdit = useCallback(() => {
        navigation.navigate('AddContact', {contact});
    }, [navigation, contact]);

    const handleToggleFavorite = useCallback(() => {
        toggleFavorite(contactId);
    }, [contactId, toggleFavorite]);

    if (!contact) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Contact not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const fullName = formatContactName(contact);
    const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {contact.avatar ? (
                            <Image
                                source={{uri: contact.avatar}}
                                style={styles.avatar}
                                accessible={true}
                                accessibilityRole="image"
                                accessibilityLabel={`${fullName} profile picture`}
                            />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>{initials}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={handleToggleFavorite}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Icon
                                name={contact.favorite ? 'star' : 'star-border'}
                                size={30}
                                color={contact.favorite ? Colors.secondary : Colors.text.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{fullName}</Text>
                    <Text style={styles.company}>{contact.company || 'No company'}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <CustomButton
                        title="Call"
                        onPress={handleCall}
                        variant="primary"
                    />
                    <CustomButton
                        title="Message"
                        onPress={handleMessage}
                        variant="secondary"
                    />
                    <CustomButton
                        title="Email"
                        onPress={handleEmail}
                        variant="secondary"
                    />
                </View>

                {/* Contact Information */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    
                    <View style={styles.infoItem}>
                        <Icon name="phone" size={20} color={Colors.text.secondary} />
                        <Text style={styles.infoText}>{contact.phone}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Icon name="email" size={20} color={Colors.text.secondary} />
                        <Text style={styles.infoText}>{contact.email}</Text>
                    </View>
                    
                    {contact.company && (
                        <View style={styles.infoItem}>
                            <Icon name="business" size={20} color={Colors.text.secondary} />
                            <Text style={styles.infoText}>{contact.company}</Text>
                        </View>
                    )}
                </View>

                {/* Notes Section */}
                {contact.notes && (
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <Text style={styles.notesText}>{contact.notes}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <CustomButton
                    title="Edit Contact"
                    onPress={handleEdit}
                    variant="secondary"
                />
                <CustomButton
                    title="Delete Contact"
                    onPress={handleDelete}
                    variant="secondary"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.container,
    },
    scrollContainer: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: Spacing.lg,
        backgroundColor: Colors.surface,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: Colors.text.light,
        fontSize: Fonts.xlarge,
        fontWeight: 'bold',
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: Spacing.xs,
        elevation: 2,
    },
    name: {
        fontSize: Fonts.xlarge,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    company: {
        fontSize: Fonts.medium,
        color: Colors.text.secondary,
    },
    actionContainer: {
        flexDirection: 'row',
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        gap: Spacing.sm,
    },
    infoSection: {
        ...GlobalStyles.card,
        marginTop: Spacing.md,
    },
    sectionTitle: {
        fontSize: Fonts.large,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    infoText: {
        fontSize: Fonts.medium,
        color: Colors.text.primary,
        marginLeft: Spacing.md,
        flex: 1,
    },
    notesText: {
        fontSize: Fonts.medium,
        color: Colors.text.primary,
        lineHeight: 22,
    },
    footer: {
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.sm,
    },
    errorContainer: {
        ...GlobalStyles.centered,
        flex: 1,
    },
    errorText: {
        fontSize: Fonts.large,
        color: Colors.text.secondary,
    },
});

export default ContactDetailsScreen;