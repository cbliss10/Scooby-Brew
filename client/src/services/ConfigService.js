import Api from '@/services/Api'

export default {
    fetchConfig () {
        return Api().get('configure')
    }
}
