import { combineRgb } from '@companion-module/base'

export function setupFeedbacks(instance) {
    instance.setFeedbackDefinitions({
        presentationActive: {
            type: 'boolean',
            name: 'Presentation active',
            description: 'Active, if the presentation mode is currently active',
            options: [],
            callback: (feedback, context) => {
                return instance.slideShowActive;
            }
        },
        slideReached: {
            type: 'boolean',
            name: 'Slide reached',
            description: 'Active, if the selected slide is currently shown',
            options: [
                {
                    type: 'number',
                    label: 'Slide number',
                    id: 'targetSlide',
                    default: 1,
                    min: 1,
                },
            ],
            callback: (feedback, context) => {
                return (instance.currentSlide == feedback.options.targetSlide);
            }
        },
        currentSlidePosition: {
            type: 'advanced',
            name: 'Slide position',
            description: 'Displays the current slide and total slide count in different formats',
            options: [
                {
                    type: 'dropdown',
                    label: 'Format',
                    id: 'displayFormat',
                    default: 0,
                    choices: [
                        {id: 0, label: "Slide x/y"},
                        {id: 1, label: "x/y"},
                        {id: 2, label: "%"},
                        {id: 3, label: "Current Slide"},
                        {id: 4, label: "Total Slide Count"},
                    ]
                },
            ],
            callback: (feedback, context) => {
                var percentage = 0;
                if(instance.currentSlide > 0 && instance.totalSlideCount > 0) {
                    percentage = Math.round(((instance.currentSlide / instance.totalSlideCount) * 100));
                }
                
                switch(feedback.options.displayFormat) {
                    case 0: return { text: "Slide " + instance.currentSlide + "/" + instance.totalSlideCount };
                    case 1: return { text: "" + instance.currentSlide + "/" + instance.totalSlideCount };
                    case 2: return { text: "" + percentage + "%"};
                    case 3: return { text: "" + instance.currentSlide};
                    case 4: return { text: "" + instance.totalSlideCount};

                }
            }
        },
        presentationName: {
            type: 'advanced',
            name: 'Presentation name',
            description: 'Shows the filename of the currently active presentation',
            options: [],
            callback: (feedback, context) => {
                return {text: instance.fileName};
            }
        },
        
    })
}