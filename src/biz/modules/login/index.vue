<template>
    <div class="p-login">
       <!-- <div class="top-block f-cb">
            <div class="col-l f-fl">
                <div class="logo">&nbsp;</div>
            </div>
            <div class="col-r f-fr">
                服务热线：0571-2620-7356
            </div>
        </div>-->
        <img src="../../imgs/logoLeftTop.png" alt="" style="width:143px;height:31px;margin-left:55px;margin-top:53px">
        <img src="../../imgs/south_net.png" alt="" style="position: absolute;width:226px;height:40px;top:53px;right:55px">
        <div class="main-block f-cb">
            <div class="col-r f-fr">
                <div class="form-wrap">
                    <div class="top-line"></div>
                    <login-form/>
                </div>
            </div>
        </div>
        <div class="bot-block">
            Copyright  2004 - 2019 京东JD.com 版权所有
        </div>
    </div>
</template>

<script>
import LoginForm from './components/loginForm'
import './styles/index.scss'
export default {
    components: {
        LoginForm
    },
    provide () {
        return {
            loginSuccess: this.loginSuccess
        }
    }
}
</script>

