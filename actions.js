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
                    required: true,
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
        goToSpecificSlide: {
            name: "Go to slide (Expression)",
            description: "Switch to a specific slide",
            options: [
                {
                    type: 'textinput',
                    label: 'Slide number',
                    id: 'targetSlide',
                    useVariables: true 
                }
            ],
            callback: async (event, context) => {
                let slideNumber = await context.parseVariablesInString(event.options.targetSlide || '');
                if(!slideNumber) {
                    return;
                }

                instance.ws.send(
                    JSON.stringify({
                        currentSlide: parseInt(slideNumber)
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
        
        blackout: {
            name: "Control Blackout",
            description: "Blackout/Whiteout/Show presentation",
            options: [
                {
                    type: 'dropdown',
                    label: 'Format',
                    id: 'targetAction',
                    default: "blackout",
                    choices: [
                        {id: "blackout", label: "Black Out"},
                        {id: "whiteout", label: "White Out"},
                        {id: "showPresentation", label: "Continue Presentation"},
                    ]
                },
            ],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: action.options.targetAction,
                    })
                )
            },
        },
        hideUnhideSlide: {
            name: "Hide/Unhide Slide",
            description: "Hide a specific slide inside the slidedeck",
            options: [
                {
                    type: 'number',
                    label: 'Slide ID (starting at 1)',
                    id: 'slideId',
                    default: 1,
                    min: 1,
                    required: true
                },
                {
                    type: 'dropdown',
                    label: 'Format',
                    id: 'targetAction',
                    default: "hideSlide",
                    choices: [
                        {id: "hideSlide", label: "Hide"},
                        {id: "unhideSlide", label: "Unhide"},
                    ]
                },
            ],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: action.options.targetAction,
                        slideId: action.options.slideId
                    })
                )
            },
        },
        unhideAllSlides: {
            name: "Unhide all slides",
            description: "Unhide all slides inside the slidedeck",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "unhideAllSlides",
                    })
                )
            },
        },
        toggleLaserPointer: {
            name: "Control Laser Pointer",
            description: "Show/Hide the laser pointer",
            options: [
                {
                    type: 'dropdown',
                    label: 'Action',
                    id: 'targetAction',
                    default: "showLaserPointer",
                    choices: [
                        {id: "showLaserPointer", label: "Show"},
                        {id: "hideLaserPointer", label: "Hide"},
                        {id: "toggleLaserPointer", label: "Toggle"},
                    ]
                },
            ],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: action.options.targetAction,
                    })
                )
            },
        },
        eraseDrawings: {
            name: "Erase drawings",
            description: "Erase drawings on the active slide made by the presenter",
            options: [],
            callback: async (action, context) => {
                instance.ws.send(
                    JSON.stringify({
                        action: "eraseDrawings",
                    })
                )
            },
        },
    })
}