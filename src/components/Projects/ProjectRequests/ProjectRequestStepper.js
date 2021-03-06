import React, { useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Typography } from '@material-ui/core';
import { useStylesCustomStepper } from '../../sharedResources';

export default function ProjectRequestStepper(props) {
    const classes = useStylesCustomStepper();
    const { currentStep, nextStep } = props;

    useEffect(() => {
    }, []);

    return (
        <div className={classes.root}>
            <div style={{ marginLeft: '100px' }}>
                Project Timeline
            </div>
            <Stepper activeStep={props.activeStep} alternativeLabel>
                {props.getSteps().map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div style={{ marginLeft: '100px' }}>
                <Typography className={classes.instructions}>Curent Step: {currentStep}</Typography>
                <br/>
                <Typography className={classes.instructions}>Next Step: {nextStep}</Typography>
            </div>
        </div>
    );
}
