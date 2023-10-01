import Vue from 'vue'
import Vuex from 'vuex'
import API_PATH from "@/constants/api_paths"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sp_categories: [],
    sp_levels: [],
    sp_types: [],
    sp_submissions: []
  },
  mutations: {
    FETCH_METADATA: (state, payload) => {
      state.sp_categories = payload.sp_categories;
      state.sp_levels = payload.sp_levels;
      state.sp_types = payload.sp_types;
    },
    UPDATE_SUBMISSIONS: (state, payload) => {
      state.sp_submissions = [ ...state.sp_submissions, ...payload];
    },
    FETCH_SUBMISSIONS: (state, payload) => {
      state.sp_submissions = payload;
    }
  },
  actions: {
    async fetchMetadata({ commit }){
      const resp = await this.$axios.post(API_PATH.metadata.get.all);
      resp.data && commit('FETCH_METADATA', resp.data );
    },
    async insertSubmission({ commit }, payload){
      const resp = await this.$axios.post(API_PATH.submission.set.one, payload);
      resp.data && commit('UPDATE_SUBMISSIONS', resp.data);
    },
    async fetchSubmissions({ commit }, payload){
      const resp = await this.$axios.post(API_PATH.submission.get.all, payload);
      resp.data && commit('FETCH_SUBMISSIONS', resp.data);
    },
    async updateSubmission({ commit }, payload){
      const resp = await this.$axios.post(API_PATH.submission.update.one, payload);
      resp.data && commit('UPDATE_SUBMISSIONS', resp.data);
    }
  },
  modules: {

  }
})