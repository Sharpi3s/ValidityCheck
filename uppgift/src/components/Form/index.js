import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Image from '../../assets/images/bg_op.png'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#1de9b6',
    },
  },
});
const useStyles = makeStyles(theme => ({
  bg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: '100vh',
      width: '100vw',
    },
    [theme.breakpoints.up('md')]: {
      height: '90vh',
      width: '70vw',
    },
    [theme.breakpoints.up('lg')]: {
      height: '100vh',
      width: '80vw',
      backgroundImage: `url(${Image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
    },
    [theme.breakpoints.up('xl')]: {
      height: '90vh',
      width: '70vw',
    },
  },
  root: {
    backgroundColor: '#fcfcfce6',
    borderRadius: '10px',
    boxShadow: '5px 5px 8px #00000040',
    padding: '2rem',
    marginTop: '2rem',
    [theme.breakpoints.down('sm')]: {
      height: '50vh',
      width: '60vw',
    },
    [theme.breakpoints.up('md')]: {
      height: '70vh',
      width: '80vw',
    },
    [theme.breakpoints.up('lg')]: {
      height: '50vh',
      width: '25vw',
    },
    [theme.breakpoints.up('xl')]: {
      height: '50vh',
      width: '22vw',
    },
  },

  headline: {
    marginBottom: '2rem',
    [theme.breakpoints.up('lg')]: {
      marginTop: '4rem'
    },
  }
}));
function Form(props) {

  const classes = useStyles();
  const [input, setInput] = React.useState("");

  const [validation, setValidation] = React.useState({
    SSN: false,
    samordningsnr: false,
    orgnr: false
  });
  const [error, setError] = React.useState("");

  const RegexSSN = (/^(18|19|20)?(\d{6}([-+]|\s)\d{4}|(?!18|19|20)\d{10})$/);

  const inputIsValid = () => {
    console.log(input);

    if(input !== "") {
      let cleanString = input.replace(/\D/g, "");
      if(input.length <= 9 || input.length > 12){
        setValidation({
          SSN: false,
          samordningsnr: false,
          orgnr: false
        });
        setError("Numret du angett är inte ett giltigt personnummer, samordningsnummer eller organisationsnummer");
        console.log('Inget personnr, samordningsnr eller orgnr hittas');
      }
      if(input.match(RegexSSN)) {
        if(cleanString.length === 12) {
          isValid(cleanString.slice(2, 12));
        }
        else if(cleanString.length === 10) {
          isValid(cleanString);
        }
        else {
          console.log('Inget personnummer hittas');
        }
      }
      else {
        if(cleanString.length === 12) {
          orgnrIsValid(cleanString.slice(2, 12));
        }
        else if(cleanString.length === 10) {
          orgnrIsValid(cleanString);
        }
        else {
          setValidation({
            SSN: false,
            samordningsnr: false,
            orgnr: false
          });
          setError("Numret du angett är inte ett giltigt personnummer, samordningsnummer eller organisationsnummer");
          console.log('Inget personnr, samordningsnr eller orgnr hittas');
        }
      }
    }
  }


  const isValid = (data) => {
    let year = parseInt(data.substring(0, 2));
    let month = parseInt(data.substring(2, 4));
    let day = parseInt(data.substring(4, 6));
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Kollar skottår
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      daysInMonth[1] = 29;
    }
    let dayIsValid = day > 0 && day <= daysInMonth[month - 1];

    if(day > 0 && day <= daysInMonth[month - 1]) {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: false
      });
      setError("");
      luhnIsValid(data, 1);
    }
    else if(dayIsValid = day > 60 && day <= daysInMonth[month - 1] + 60) {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: false
      });
      setError("");
      luhnIsValid(data, 2);
    }
    else if(!dayIsValid && month > 19) {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: false
      });
      setError("");
      orgnrIsValid(data);
    }
    else {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: false
      });
      setError("");
      orgnrIsValid(data);
      console.log('Inget personr, samordningsnr eller orgnr');
    }
  }

  const orgnrIsValid = (data) => {
    let controlNr = parseInt(data.substring(2, 4));
    if(controlNr > 19) {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: true
      });
      setError("");
      luhnIsValid(data, 3);
    }
    else {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: false
      })
      setError("Numret du angett är inte ett giltigt personnummer, samordningsnummer eller organisationsnummer");
    }
  }

  const luhnIsValid = (data, isFrom) => {
    let sum = 0;
    let numdigits = data.length;
    let parity = numdigits % 2;
    let i;
    let digit;

    for (i = 0; i < numdigits; i = i + 1) {
      digit = parseInt(data.charAt(i))
      if (i % 2 === parity) digit *= 2;
      if (digit > 9) digit -= 9;
      sum += digit;
    }

    let valid = (sum % 10) === 0

    if(isFrom === 1) {
      setValidation({
        SSN: valid ? true : false,
        samordningsnr: false,
        orgnr: false
      });
      setError(!valid ? "Personnumret är ogiltigt" : '');
      console.log('SSN');
    }
    if(isFrom === 2) {
      setValidation({
        SSN: false,
        samordningsnr: valid ? true : false,
        orgnr: false
      });
      setError(!valid ? "Samordningsnumret är ogiltigt" : '');
      console.log('Samordningsnr');
    }
    if(isFrom === 3) {
      setValidation({
        SSN: false,
        samordningsnr: false,
        orgnr: valid ? true : false
      });
      setError(!valid ? "Numret du angett är inte ett giltigt personnummer, samordningsnummer eller organisationsnummer" : '');
      console.log('Orgnr');
    }

  }

  const onChangeSSN = (e) => {
    setInput(e.target.value);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.bg}>
        <div className={classes.root}>
          <Grid 
            container
            alignItems='center'
            justifyContent='center'
          >
            <Grid item xs={12}>
              <h3 className={classes.headline}>Verifiera personnummer, samordningsnummer eller organisationsnummer</h3>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-number"
                onChange={onChangeSSN}
                fullWidth
                color="primary"
                style={{ backgroundColor: '#fff'}}
                // placeholder='YYMMDDXXXX'
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={inputIsValid} fullWidth color="primary">Verifiera</Button>
            </Grid>
            <Grid item xs={12}>
                { validation.SSN ? <span style={{ display: 'flex', alignItems: 'center' }}><p style={{ marginRight: '0.5rem' }}>Personnumret är giltigt</p> <CheckCircleOutlineIcon style={{ color: '#009944' }} /></span> : "" }
                { validation.samordningsnr ? <span style={{ display: 'flex', alignItems: 'center' }}><p style={{ marginRight: '0.5rem' }}>Samordningsnumret är giltigt</p> <CheckCircleOutlineIcon style={{ color: '#009944' }} /></span> : "" }
                { validation.orgnr ? <span style={{ display: 'flex', alignItems: 'center' }}><p style={{ marginRight: '0.5rem' }}>Organisationsnumret är giltigt</p> <CheckCircleOutlineIcon style={{ color: '#009944' }} /></span> : "" }
                { error !== "" ? <span style={{ display: 'flex', alignItems: 'center' }}><p style={{ marginRight: '0.5rem' }}>{ error }</p><HighlightOffIcon style={{ color: '#cf000f' }} /></span> : "" }

            </Grid>
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Form;