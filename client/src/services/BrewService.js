import Api from '@/services/Api'

export default {
    fetchData () {
        return Api().get('get-data')
    },
    postData (data) {
        return Api().post('brewery-input', data)
    }
}
