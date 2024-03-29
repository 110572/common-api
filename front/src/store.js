import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		loginInfo: {
			userInfo: null,
			token: null
    },
    breadcrumb: []
	},
	mutations: {
		/**
     * 登录
     * @param {Object} state 
     * @param {Object} userInfo 用户信息
     * @param {String} token 登录Token
     */
		login(state, user) {
			localStorage.setItem('login_token', user.token)
			state.loginInfo.token = user.token
			state.loginInfo.userInfo = user.userInfo
		},
		/**
     * 注销
     * @param {Object} state 
     */
		logout(state) {
			localStorage.removeItem('login_token')
			state.loginInfo.token = null
			state.loginInfo.userInfo = null
    },
    /**
     * 设置面包屑导航
     * @param {Object} state 
     * @param {Array} breadcrumbArr 面包屑导航的内容
     */
    setBreadcrumb(state, breadcrumbArr) {
      state.breadcrumb = breadcrumbArr
    }
	}
})