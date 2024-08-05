type NOTIFY_TYPE = 'success' | 'primary' | 'danger' | 'info' | 'warning' | 'secondary' | 'dark' | 'light'

const useNotify = (type: NOTIFY_TYPE, message: String) => {
    const id: string = Math.random().toString()
    const container = () => {

        const element = document.getElementsByClassName('toast-container')

        if (element.length) {
            return element[0]
        } else {
            const divEl = document.createElement("div")
            divEl.classList.add('toast-container', 'position-fixed', 'end-0', 'top-0', 'mt-2', 'me-2')
            document.body.appendChild(divEl)
            return divEl
        }
    }

    const build = () => {
        let elContainer = container()

        const divEl = document.createElement("div")
        divEl.id = id
        const elClass = `toast fade bg-${type} text-white border-0 mb-3`
        divEl.setAttribute('class', elClass)
        divEl.setAttribute('role', 'alert')
        divEl.setAttribute('aria-live', 'assertive')
        divEl.setAttribute('aria-atomic', 'true')

        const content = `<div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>`

        divEl.innerHTML = content
        elContainer.appendChild(divEl)

        divEl.addEventListener('hidden.bs.toast', function () {
            // elContainer.removeChild(divEl)
        })

        return elContainer
    }

    const show = () => {
        build()
        const el = document.getElementById(id)
        if (el) {
            const toast = new bootstrap.Toast(el)
            toast.show()
        }
    }
    return {
        build,
        show
    }
}

export default useNotify