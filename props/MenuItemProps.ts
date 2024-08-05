const MenuItemProps = {
    id: {
        type: Number
    },
    code: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    priority: {
        type: Number,
        default: 0
    },
    path: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    parentId: {
        type: Number
    },
    childs: {
        type: Array,
        default: []
    },
    label: {
        type: String,
        default: ''
    },
    isSub: {
        type: Boolean,
        default: false
    },
    svg: {
        type: String,
        default: ''
    }
}

export default MenuItemProps