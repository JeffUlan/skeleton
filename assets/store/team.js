import {teamservice} from "../services/teamservice";

const state = {
    show_invite_form: false,
    invite_sending_in_progress: false,
    invite_successfully_processed: false,
    invite_error: undefined,
    current_invite: undefined,
    cancel_invite_in_progress: false,
    sent_invites: [],
    members: [],
    team_error: undefined,
}

const actions = {
    cancelInvite({commit}, {invite}) {
        commit('startCancelInvite', invite);
        teamservice.cancelInvite(invite).then(
            result => {
                commit('removeInvite', invite);
            },
            error => {
                commit('setTeamError', error);
            }
        )
    },
    showInviteForm({commit}) {
        commit('showInviteFormEnable');
    },
    hideInviteForm({commit}) {
        commit('showInviteFormDisable');
    },
    sendAnother({commit}) {
        commit('resetInvite')
    },
    sendInvite({commit}, {email}) {

        commit('startInviteProcess');

        if (email === "" || email === undefined || email === null) {
            commit('inviteError', 'An email must be provided')
            return;
        }

        teamservice.invite(email).then(
            result => {
                commit('inviteSent');
            },
            error => {
                console.log(error)
                commit('inviteError', error)
            }
        )
    },
    loadTeamInfo({commit}) {
        teamservice.getTeam().then(result => {
                commit("setTeamInfo", result.sent_invites, result.members);
            },
            error => {
                commit("setTeamError", error);
            })
    }
}

const mutations = {
    startCancelInvite(state, invite) {
        state.current_invite = invite;
        state.cancel_invite_in_progress = true;
    },
    removeInvite(state, invite) {
        const invites = state.sent_invites;
        const index = invites.indexOf(invite);
        invites.splice(index, 1);

        state.current_invite = undefined;
        state.cancel_invite_in_progress = false;
    },
    setTeamInfo(state, sent_invites, members) {
        state.sent_invites = sent_invites;
        state.members = members;
    },
    setTeamError(state, error) {
        state.team_error = error
    },
    resetInvite(state) {
        state.invite_successfully_processed = false;
        state.invite_error = undefined;
    },
    showInviteFormEnable(state) {
        state.show_invite_form = true;
    },
    showInviteFormDisable(state) {
        state.show_invite_form = false;
    },
    startInviteProcess(state) {
        state.invite_sending_in_progress = true;
        state.invite_error = undefined;
    },
    inviteError(state, error) {
        state.invite_sending_in_progress = false;
        state.invite_error = error;
    },
    inviteSent(state) {
        state.invite_error = undefined;
        state.invite_sending_in_progress = false;
        state.invite_successfully_processed = true;
    }
}

export const teamStore = {
    namespaced: true,
    state,
    actions,
    mutations,
}