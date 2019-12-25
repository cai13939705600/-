/**
 * chooseUniqueSelect 选择唯一值
 * @params [Boolean] 是否唯一值
 */
export const chooseUniqueSelect = {
    inserted (el, binding, vnode) {
        if (binding.value) {
            const instance = vnode.componentInstance;
            instance.selectOptionClick()
        }
    },
    update (el, binding, vnode) {
        if (binding.value !== binding.oldValue) {
            const instance = vnode.componentInstance;
            instance.selectOptionClick()
        }
    }
}
