export function setupActions(instance) {
    instance.setActionDefinitions({
        startPresentation: {
            name: "Begin Presentation",
            description: "Switch to the presentation mode",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        slideShowActive: true
                    })
                )
            },
        },
        endPresentation: {
            name: "End Presentation",
            description: "Exit the presentation mode",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        slideShowActive: false
                    })
                )
            },
        },
        nextSlide: {
            name: "Next slide",
            description: "Switch to the next slide",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "next"
                    })
                )
            },
        },
        previousSlide: {
            name: "Previous slide",
            description: "Switch to the previous slide",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "previous"
                    })
                )
            },
        },
        firstSlide: {
            name: "First slide",
            description: "Switch to the first slide",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "first"
                    })
                )
            },
        },
        lastSlide: {
            name: "Last slide",
            description: "Switch to the last slide",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "last"
                    })
                )
            },
        },
        goToSlide: {
            name: "Go to slide",
            description: "Switch to a specific slide",
            options: [
                {
                    type: 'number',
                    label: 'Slide number',
                    id: 'targetSlide',
                    default: 1,
                    min: 1,
                    required: true
                }
            ],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        currentSlide: action.options.targetSlide
                    })
                )
            },
        },
        openPresentation: {
            name: "Open presentation",
            description: "Switch to a specific presentation",
            options: [
                {
                    type: 'textinput',
                    label: 'Path to presentation',
                    id: 'targetPath',
                    required: true
                },
                {
                    type: 'checkbox',
                    label: 'Close all other files',
                    default: true,
                    id: 'closeOthers',
                    required: true
                }
            ],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "openPresentation",
                        path: action.options.targetPath,
                        closeOthers: action.options.closeOthers
                    })
                )
            },
        },
        closeAll: {
            name: "Close all presentations",
            description: "Close all currently opened presentations",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "closeAll"
                    })
                )
            },
        },
    })
}