import { StyleSheet, Platform } from 'react-native';
import { Colors } from './Colors';

export const globalStyles = StyleSheet.create({

//Autenticación
    //Container Auth
    containerAuth: {
        flex: 1,
        backgroundColor: Colors.authBg,
    },
    //Icon Container Login/RecoverPass
    iconContainerAuthA: {
        flex: 0.35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    //Icon Container NewPass/Verification
    iconContainerAuthB: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    //Icon Imagen Login/NewPass/RecoverPass/
    profileImageAuthA: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.iconAppBg,
        marginBottom: 25,
    },
    //Icon Imagen Signup/Verification
    profileImageAuthB: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.iconAppBg,
        marginBottom: 15,
    },
    //Titulo Auth
    titleAuth: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textLight,
    },
    //Subtitulo Auth
    subtitleAuth: {
        fontSize: 14,
        color: Colors.textMedium,
        marginTop: 8,
    },
    //Link Auth
    linkTextAuth: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    //Bottom Section Auth Login/NewPass/RecoverPass
    bottomSectionAuth: {
        flex: 0.65,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    //Form Auth
    formAuth: {
        width: '100%',
        maxWidth: 300,
        gap: 15,
        marginBottom: 20,
    },
    //Label Auth
    labelAuth: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPlaceholder,
        marginBottom: -5,
    },
    //Input Auth
    inputAuth: {
        backgroundColor: Colors.input,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        color: Colors.textDark,
    },
    //Button Auth
    buttonAuth: {
        backgroundColor: Colors.primary,
        width: '100%',
        maxWidth: 300,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonTextAuth: {
        color: Colors.textLight,
        fontSize: 16,
        fontWeight: 'bold',
    },
    

//App Kollaborate
    containerApp: {
        flex: 1,
        backgroundColor: Colors.appBg,
    },
//General
    //ContentSection Home/Profile(Index) 
    contentSectionA: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center', 
        padding: 20,
    },
    //ContentSection Mailbox(Index)/Profile(Record)/Profile(Token)
    contentSectionB: { 
        flex: 1, 
        marginTop: 25, 
        backgroundColor: Colors.card, 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        paddingHorizontal: 25, 
        paddingTop: 25 
    },
    //Section Title Mailbox(index)/Record/Token
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: '700',
        color: Colors.textDark, 
        marginBottom: 15,
        textAlign: 'center'    
    },

//Profile
    //Pagina Record/Token
    selectorContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        elevation: 3,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectorButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    selectorButtonActive: {
        backgroundColor: Colors.primary,
    },
    selectorText: {
        fontWeight: '600',
        color: Colors.textMuted,
    },
    selectorTextActive: {
        color: Colors.textLight,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    itemDate: { 
        fontSize: 12, 
        color: Colors.textPlaceholder, 
        marginTop: 2 
    },
    itemDescription: { 
        fontSize: 15, 
        color: Colors.textDark 
    },
    positiveAmount: { 
        color: Colors.success 
    },
    negativeAmount: { 
        color: Colors.error 
    },

    //Pagina EditProfile/Statistics
    scrollContainer: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    
    //Pagina EditProfile/ProfileResult
    inputText: {
        fontSize: 15,
        color: Colors.textDark,
    },

    //Pagina EditProfile/Skills
    input: {
        backgroundColor: Colors.input,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.borderDark,
    },

    //Pagina Profile(Index)/MBNotify/ProfileResult
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 15,
        margin: 20,
        padding: 25,
        elevation: 5,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: Colors.borderDefault,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.textDark,
    },
    institution: {
        fontSize: 11,
        color: Colors.textMuted,
        textAlign: 'center',
        marginBottom: 10,
    },
    rankContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    rankText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    skillsSection: {
        flex: 1,
        paddingVertical: 5,
    },
    innerDivider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: 5,
    },

    //Pagina MBNotify/ProfileResult
    leftColumn: {
        flex: 0.40,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: Colors.borderLight,
        paddingRight: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.borderDefault,
        marginBottom: 8,
    },
    rightColumn: {
        flex: 0.60,
        paddingLeft: 15,
        justifyContent: 'space-between',
    },
    requestContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 20,
        elevation: 4,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: Colors.borderDefault,
    },
    leftRequestColumn: {
        flex: 0.65,
        borderRightWidth: 1,
        borderRightColor: Colors.borderLight,
        paddingRight: 15,
    },
    infoGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textLabel,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.textDark,
    },  
    rightRequestColumn: { 
        flex: 0.35,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
    },

    tokenLabel: { 
        fontSize: 10,
        color: Colors.textMuted,
        marginBottom: 5,
    },

    tokenAmount: { 
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },

    tokenSub: { 
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    button: {
        flex: 1, 
        marginHorizontal: 8, 
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    buttonAccept: {
        backgroundColor: Colors.success,
    },
    buttonReject: {
        backgroundColor: Colors.primary,
    },  
    buttonText: {
        color: Colors.textLight,
        fontSize: 16,
        fontWeight: 'bold',
    },

    //Pagina Statistics
    statisticsCard: {
        paddingVertical: 75,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        marginHorizontal: 5,
        marginBottom: 20,
        borderRadius: 12,
        padding: 4,
        elevation: 3,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    //Pagina Sala Clases/MailBox(Index)
    headerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        padding: 20, 
        color: Colors.textDark,
        textAlign: 'center'
    },

    //Pagina Mailbox(Index)/Search(Index)
    modalOverlay: { 
        flex: 1, 
        backgroundColor: Colors.overlay,
        justifyContent: 'center', 
    },
    modalContent: { 
        backgroundColor: Colors.whiteBg, 
        borderRadius: 20, 
        padding: 20 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    

});
