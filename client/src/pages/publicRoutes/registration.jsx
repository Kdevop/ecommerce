// import dependencies
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

// import components
import ButtonComp from '../../components/button/button';



function Registration() {
    return (
        <div>
            <div>
                <h3>Welcome to ECommerce Quick 👋</h3>
                <span>Please create your account.</span>
            </div>
            <div>
                <Box>
                    <Grid>
                        
                    </Grid>
                </Box>
            </div>
        </div>    
    );
};

export default Registration;