import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Typography } from '@material-ui/core';
import { useStylesCustomStepper } from './sharedResources';

export default function CustomStepper(props) {
    const classes = useStylesCustomStepper();
    const content = props.getStepContent(props.activeStep)

    return (
        <div className={classes.root}>
            <Stepper activeStep={props.activeStep} alternativeLabel>
                {props.getSteps().map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                <Typography className={classes.instructions}>{content}</Typography>
            </div>
        </div>
    );
}
