<template>
    <el-form class="login-form" ref="form" :model="model" :rules="rules" @submit.native.prevent>
        <div class="form-hd"></div>
        <div class="form-bd">
            <el-form-item prop="username">
                <el-input placeholder="账户" v-model="model.username" @keyup.enter.native="handleLogin">
                    <template slot="prepend"><i class="icon-user"></i></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="密码" :type="delivery?'text':'password'" v-model="model.password"
                          @keyup.enter.native="handleLogin">
                    <template slot="prepend"><i class="icon-lock"></i></template>
                    <template slot="suffix">
                        <img v-if="delivery==true"  src="../../../imgs/loginOpenEyes.png" @click.stop="toggleCodeState">
                        <img v-if="delivery==false" src="../../../imgs/loginCloseEyes.png" @click.stop="toggleCodeState">
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="login-btn" type="primary" @click="handleLogin" :loading="logining">登录</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script>
    import cookie from 'js-cookie'

    export default {
        data() {
            return {
                logining: false,
                model: {
                    username: cookie.get('userName') || '',
                    password: '',
                },
                delivery: false,
                rules: {
                    username: [
                        {validator: this.validUname, trigger: 'blur'}
                    ],
                    password: [
                        {validator: this.validPwd, trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            console.log(cookie.get('userName'));

        },
        methods: {
            validPwd(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请输入密码'))
                }
                callback()
            },
            validUname(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请输账户'))
                }
                callback()
            },
            handleLogin() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return
                    }
                    this.logining = true
                    api.base.login({...this.model, loginType: 1}).then(({head, body}) => {
                        if (head.code !== '200') {
                            this.$message.error(head.subMessage)
                        } else {
                            const {jwt, tenantId, qpId} = body
                            cookie.set('jwt', jwt)
                            cookie.set('tenantId', tenantId)
                            cookie.set('qpId', qpId)
                            cookie.set('userName', this.model.username)
                            this.$store.commit('app/update', {logined: true})
                            this.$router.push({
                                path: CNST.ROUTES.ROOT.path
                            })
                        }
                        this.logining = false
                    })
                })
            },
            //切换密码状态
            toggleCodeState() {
                this.delivery=(this.delivery==true)?false:true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-hd {
        height: 32px;
        margin-bottom: 38px;
        background: url('../../../imgs/loginTitle.png') no-repeat top left;
        background-size: 100% auto;
    }

    .form-bd {
        .el-form-item {
            margin-bottom: 20px;
        }

        .login-btn {
            width: 100%;
            background-color: #3368F4;
            border-radius: 2px;
        }
    }

    .form-ft {
        color: #666;
        text-align: center;

        .el-divider {
            margin: 0 25px;
        }
    }

    .login-form {
        width: 392px !important;
        padding: 48px 48px 28px 48px !important;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

        /deep/ .el-input__suffix-inner {
            .el-switch {
                .el-switch__core {
                    top: 14px;
                }
            }
        }
    }

    .el-input__suffix {
        img {
            margin-top: 13px;
            cursor: pointer;
        }
    }
</style>

