import React from 'react';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import EuroInput from './EuroInput'
import PercentInput from './PercentInput'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EditIcon from '@material-ui/icons/Edit';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import CopyrightIcon from '@material-ui/icons/Copyright';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NumberFormat from 'react-number-format';

let theme = createMuiTheme({
  typography: {
    h1: {
      color: '#d82b2b',
      fontSize: "2.5rem",
      marginTop: 20,
      marginBottom: 20,
    },
    h2: {
      color: '#224d6b',
      fontSize: "1.7rem",
      marginBottom: 20,
    },
    h3: {
      color: '#224d6b',
      fontSize: "1.3rem",
      fontWeight: 300,
    },
    body1: {
      color: "#224d6b",
      fontSize: "1.0rem",
    },
  },
});
theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  }
}));

const Paper1 = withStyles({
  root: {
    background: 'linear-gradient(160deg, #fff 40%, #eff9fe 130%)',
  },
})(Paper);

const Paper2 = withStyles({
  root: {
    background: 'linear-gradient(160deg, #fff 40%, #fbf0fc 130%)',
  },
})(Paper);

const Paper3 = withStyles({
  root: {
    background: 'linear-gradient(160deg, #fff 40%, #f1f9ef 130%)',
  },
})(Paper);

function App() {
  const classes = useStyles();

  const initialState = {
    toInvest1: 3600,
    corporateTaxRate: 20,
    dividendTaxRate: 7.5,
    toInvest2: 0, //net dividend
    years: 25,
    grossYield: 7,
    mgmtFee1: 2.5,
    mgmtFee2: 1,
    netYield1: 0,
    netYield2: 0,
    capital1: 0,
    capital2: 0,
    futureValue1: 0,
    futureValue2: 0,
    taxable1: 0,
    taxable2: 0,
    tax1: 30,
    tax2: 30,
    net1: 0,
    net2: 0,
  }

  const calculate = (data) => {
    const result = { ...data };

    const corporateTax = result.corporateTaxRate/100
    const dividendTax = result.dividendTaxRate/100

    result.toInvest2 = Math.round(result.toInvest1 * (1-corporateTax) * (1-dividendTax));

    result.netYield1 = result.grossYield - result.mgmtFee1;
    result.netYield2 = result.grossYield - result.mgmtFee2;

    result.capital1 =  result.toInvest1 * result.years;
    result.capital2 =  result.toInvest2 * result.years;

    //future value of an annuity for both scenarios
    let rate = result.netYield1/100;
    let factor = (Math.pow((1+rate), result.years) - 1) / rate;
    result.futureValue1 = Math.round( (result.toInvest1 * factor) * (1+rate) )

    rate = result.netYield2/100;
    factor = (Math.pow((1+rate), result.years) - 1) / rate;
    result.futureValue2 = Math.round( (result.toInvest2 * factor) * (1+rate) );

    // taxable portions
    result.taxable1 = result.futureValue1;
    result.taxable2 = result.futureValue2 - result.capital2;

    // net values after taxes
    result.net1 = Math.round(result.taxable1 * (1-(result.tax1/100)));
    result.net2 = Math.round(result.capital2 + result.taxable2 * (1-(result.tax2/100)));

    //console.log(result)
    return result;
  }

  const [state, setState] = React.useState(calculate(initialState));

  const handleChange = ({ target }) => {
    const { name, value } = target;
    const newState = calculate({ ...state, [name]: value });
    setState(newState);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" >
        <CssBaseline />

        <Box mt={6} mb={4}>
          <Typography variant="h1">
            Yrittäjän eläkesijoitusvertailu
          </Typography>
        </Box>

        <Paper1 className={classes.paper}>
          <Typography variant="h2">
            Vuosittain säästettävä summa
          </Typography>
          <Typography>
            Yrityksen maksama summa eläkevakuutukseen
          </Typography>
          <Grid container spacing={2} >
            <Grid item sm={12}>
              <EuroInput
                label="Sijoitettava summa"
                helperText="Yrityksen enintään 8500 e/vuosi maksama summa on vähennyskelpoinen kulu."
                name="toInvest1"
                value={state.toInvest1}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Typography>
            Jos sama summa nostetaan osinkona
          </Typography>
          <Grid container spacing={2} >
            <Grid item sm={12}>
              <PercentInput
                label="Yhteisövero"
                helperText=""
                name="corporateTaxRate"
                value={state.corporateTaxRate}
                onChange={handleChange}
                />
            </Grid>
            <Grid item sm={12}>
              <PercentInput
                label="Osinkovero"
                helperText=""
                name="dividendTaxRate"
                value={state.dividendTaxRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item sm={12}>
              <EuroInput
                label="Osinko"
                helperText="Yrittäjälle käteen jäävä osinko sijoitettavaksi henkilökohtaiseen sijoitukseen"
                name="toInvest2"
                value={state.toInvest2}
                readOnly={true}
              />
            </Grid>
          </Grid>
        </Paper1>

        <Paper2 className={classes.paper}>
          <Typography variant="h2">
            Tuotto-odotus ja hallinnointikulut
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PercentInput
                label="Tuotto-odotus"
                helperText="Sijoituksen tuotto-odotus ennen hallinnointikuluja"
                name="grossYield"
                value={state.grossYield}
                onChange={handleChange}
                />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h3" className={classes.h3}>
                Yritys sijoittaa eläkevakuutukseen
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h3" className={classes.h3}>
                Yrittäjä itse sijoittaa rahastoihin
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <PercentInput
                label="Hallinnointikulut"
                helperText="Vakuutuskuoren ja sijoitusrahastojen hallinnointipalkkiot yhteensä. Yleensä noin 1,5% + 1%"
                name="mgmtFee1"
                value={state.mgmtFee1}
                onChange={handleChange}
                />
            </Grid>
            <Grid item xs={6}>
              <PercentInput
                label="Hallinnointikulut"
                helperText="Sijoitusrahastojen hallinnointipalkkio yhteensä. Yleensä noin 1%"
                name="mgmtFee2"
                value={state.mgmtFee2}
                onChange={handleChange}
                />
            </Grid>
            <Grid item xs={6}>
              <PercentInput
                label="Todellinen vuosituotto"
                helperText=""
                name="netYield1"
                value={state.netYield1}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <PercentInput
                label="Todellinen vuosituotto"
                helperText=""
                name="netYield2"
                value={state.netYield2}
                readOnly
              />
            </Grid>
          </Grid>
        </Paper2>

        <Paper3 className={classes.paper}>
          <Typography variant="h2">
            Eläkesäästön arvo
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                  type="number"
                  fullWidth
                  variant="outlined"
                  label="Sijoitusaika"
                  helperText=""
                  name="years"
                  value={state.years}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EditIcon fontSize="small" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">v</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: 100,
                    style: {
                      textAlign: 'right',
                    },
                  }}
                  FormHelperTextProps={{ style: { textAlign: 'right' } }}
                />
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Vuosittainen sijoitus eläkevakuutukseen: <br/>
                <NumberFormat value={state.toInvest1} displayType="text" thousandSeparator=" " suffix=' €'/>
              </Typography>

            </Grid>
            <Grid item xs={6}>
            <Typography>
                Vuosittainen sijoitus rahastoihin: <br/>
                <NumberFormat value={state.toInvest2} displayType="text" thousandSeparator=" " suffix=' €'/>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Sijoitettu pääoma"
                helperText=""
                name="capital1"
                value={state.capital1}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Sijoitettu pääoma"
                helperText=""
                name="capital2"
                value={state.capital2}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Sijoituksen kokonaisarvo"
                helperText=""
                name="futureValue1"
                value={state.futureValue1}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Sijoituksen kokonaisarvo"
                helperText=""
                name="futureValue2"
                value={state.futureValue2}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Verotettava osuus"
                helperText="Vakuutuksen arvo on kokonaan verotettavaa ansiotuloa"
                name="taxable1"
                value={state.taxable1}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Verotettava osuus"
                helperText="Sijoituksen tuotto on verotettavaa pääomatuloa"
                name="taxable2"
                value={state.taxable2}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <PercentInput
                label="Ansiotulovero"
                helperText=""
                name="tax1"
                value={state.tax1}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <PercentInput
                label="Pääomavero"
                helperText=""
                name="tax2"
                value={state.tax2}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h3" className={classes.h3}>
                Yrittäjän käteen jäävä osuus
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <EuroInput
                label="Netto"
                helperText=""
                name="net1"
                value={state.net1}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
            <EuroInput
                label="Netto"
                helperText=""
                name="net1"
                value={state.net2}
                readOnly
              />
            </Grid>
          </Grid>
        </Paper3>

        <Box mt={8} mb={9}>
          <Typography variant="h2" >
            Disclaimer
          </Typography>
          <div>
            Tämä laskuri:
            <ol>
              <li>ei ole kannanotto minkään sijoitus- tai säästämismuodon puolesta</li>
              <li>on yksinkertaistettu monella tapaa. Se mm. ei ota huomioon henkilökohtaisten
                rahastojen voittojen verokohtelua, jos niillä tehdään kauppaa säästämisaikana.</li>
            </ol>
            </div>
            <div>
              Valitessasi eläkesäästämisen muotoa, pohdi omalta kannaltasi ainakin seuraavia asioita:
              <ul>
                <li>Verotus: varojen verokohtelu ja vähennysoikeudet
                  <ol>
                    <li>sijoitushetkellä</li>
                    <li>säästämisaikana (myyntien verotus ja tappioiden vähennysoikeus)</li>
                    <li>eläkettä nostettaessa</li>
                  </ol></li>
                <li>Kulut: eri sijoitusmuotojen kuluissa on eroja ja pitkällä aikavälillä pienetkin erot saattavat olla merkittäviä</li>
                <li>Tilanteen muuttuminen ennen eläkeikää (millä ehdoilla voit nostaa eläkesäästöjä ennen eläkeikää)</li>
              </ul>
            </div>
        </Box>

        <Box mt={8} mb={9} >
          <Grid container alignItems="center" justify="center" spacing={1} >
            <Grid item>
                <CopyrightIcon fontSize="small" />
            </Grid>
            <Grid item>
              Veikko Mäkinen
            </Grid>
          </Grid>
          <Grid container alignItems="center" justify="center" spacing={1} >
            <Grid item>
              <Link href="https://www.linkedin.com/in/vmakinen/" target="_blank" >
                <LinkedInIcon fontSize="small" />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://www.linkedin.com/in/vmakinen/" target="_blank">
                https://www.linkedin.com/in/vmakinen/
              </Link>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justify="center" spacing={1} >
            <Grid item>
              <Link href="https://github.com/v-dogg/yrittajanelakesijoitus" target="_blank">
                <GitHubIcon fontSize="small" />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://github.com/v-dogg/yrittajanelakesijoitus" target="_blank">
                https://github.com/v-dogg/yrittajanelakesijoitus 
              </Link>
              <span style={{color: '#aaa', fontSize: 10 }}>
                {' ('} { process.env.REACT_APP_GIT_HASH } {')'}
              </span>
            </Grid>
          </Grid>
        </Box>

      </Container>
    </ThemeProvider>
  );
}

export default App;
