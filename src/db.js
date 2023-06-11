import firebase from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database"

class Database {

    /** @type {firebase.FirebaseApp} */
    _app;

    constructor() {
        this._app = firebase.initializeApp({
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        });
    }

    /**
     * Get an guild object from an ID, if none, create it.
     * @returns {import("./structures.d.ts").PogGuild}
     */
    getGuild(id) {
            get(child(ref(getDatabase(this._app), `guilds/${id}`))).then((snapshot) => {
                if (snapshot.exists())
                    return snapshot.val();
                else {
                    _createGuild();
                    return _getDefaults();
                }
                }).catch((error) => {
                    console.error(`Could not get guild (GID: ${id}): ${error.toString()}`);
                })
    }

    getScore(guildId, memberId) {
        get(child(ref(getDatabase(this._app), `guilds/${guildId}/scores/${memberId}`))).then((snapshot) => {
            if (snapshot.exists())
                return snapshot.val();
            else {
                _createScore(guildId, memberId);
                return _getDefaults();
            }
            }).catch((error) => {
                console.error(`Could not get score (GID: ${guildId} | UID: ${memberId}): ${error.toString()}`);
            })    
    }

    /** Creates an guild object. */
    _createGuild(id) {
        const _ref = ref(getDatabase(this._app), `guilds/${id}`);

        set(_ref, this._getDefaults());
    }

    _createScore(guildId, memberId) {
        const _ref = ref(getDatabase(this._app), `guilds/${guildId}/scores/${memberId}`);

        set(_ref, 0);
    }

    /**
     * Get an guild object with the default values.
     * @returns {import("./structures.d.ts").PogGuild}
     */
    _getDefaults() {
        return {
            settings: {}
            master: null
        };
    }
}