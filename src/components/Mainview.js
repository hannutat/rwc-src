import { Button, Container, IconButton, List, ListItem, 
    ListItemText, TextField, Typography, Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeyboardArrowRight as Arrow, Favorite } from '@material-ui/icons/';
import Favoritebox from './Favoritebox';

const useStyles = makeStyles({
    mainContainer :     { marginLeft : "180px",
                          paddingTop : "30px" },
    searchContainer:    { borderRadius : "5px",
                          border : "1px solid lightgrey",
                          boxShadow : "3px 3px 3px lightgrey",
                          marginTop : "30px",
                          overflow : "auto"},
    resultContainer :   { maxHeight : "500px",
                          overflow : "auto",
                          marginBottom : "10px",
                          position : "relative"},
    subtitle :          { marginTop : "10px"},
    searchButton :      { marginLeft : "30px",
                          width : "100px" },
    searchHelpText :    { marginTop : "10px",
                          marginBottom : "15px"},
    searchHelpText2 :   { marginTop : "30px",
                          marginLeft : "25px"},
    listItem :          { border : "1px solid lightgrey",
                          margin : "2px",
                          borderRadius : "3px",
                          width : "450px" },
    favoritesContainer: { height : "300px",
                          width : "600px",
                          borderRadius : "5px",
                          border : "1px solid lightgrey",
                          boxShadow : "3px 3px 3px lightgrey",
                          marginTop : "30px",
                          marginLeft : "auto",
                          marginRight : "auto"},
    gridCont :          { marginLeft : "auto",
                          marginRight : "auto",
                          height : "212px",
                          overflow : "hidden"},
    allFavButton:       { float: "right"},
    noFavCont :         { height : "212px",
                          paddingTop :"40px" },
    searchField :       { marginLeft : "60px"},
    progress :          { display : "block",
                          marginLeft : "auto",
                          marginRight : "auto",
                          marginTop : "40px"},
    errorText :         { marginTop : "20px",
                          color : "red"}
});

export default function Mainview(props){

    const styles = useStyles();
    const [userInput, setUserInput] = useState();   
    const [searchResultList, setSearchResultList] = useState([]);
    const [inputError, setInputError] = useState();
    const [connError, setConnError] = useState("");

    const updateSearchResultList = (term) => {

        let uniqueNameList = props.stationList.filter( (data, idx) => {
            return (props.stationList.findIndex(obj => obj.stationName === data.stationName) === idx);
        });

        let newResultList = uniqueNameList.filter( (data) => {
            return (data.stationName.toLowerCase().includes(term.toLowerCase()));
        });

        setSearchResultList(newResultList);
    }

    const formHandler = (e) => {
        e.preventDefault();

        if (!userInput) {
            setInputError("Enter search term.");
        } else if (!props.loaded) {
            setInputError("Unable to fetch data. Try again later.");
        } else {
            setInputError("");
            updateSearchResultList(String(userInput));
            props.setLatestInput({...props.latestInput, input : userInput});
        }
    }

    useEffect( () => {
        if (!props.stationList) {
            props.loadStationDataFromApi();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect( () => {
        let connTimer = setTimeout( () => { if (!props.loaded) {
                              setConnError("Error fetching data. Please try again later."); 
                          }}, 15000);
        clearTimeout(connTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect( () => {
        if (props.latestInput.fromView) {
            if (props.latestInput.input) {
                updateSearchResultList(props.latestInput.input);
            }
            props.setLatestInput({...props.latestInput, fromView : false});
        } else {
            props.setLatestInput({...props.latestInput, input : ""});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    return (
        <Container maxWidth="md"
                   className={styles.mainContainer}>

            <Typography align="center"
                        variant="h5"
            >Road Weather Cameras</Typography>

            <Container maxWidth="sm"
                        className={styles.favoritesContainer}>

                <Typography className={styles.subtitle}
                            variant="h6"
                >Favorites</Typography>

                { (props.favorites.length > 0)

                ?   (props.loaded)
                
                    ?   <Grid container
                            justify="center"
                            className={styles.gridCont}>
                            
                            { props.favorites.map( (station) => {
                                return (
                                    <Favoritebox key={station.stationId}
                                                cameraData={props.cameraData}
                                                deleteFavorite={props.deleteFavorite}
                                                station={station}
                                                fromView="1"
                                                loaded={props.loaded}
                                    ></Favoritebox>
                                );
                            })}
                        </Grid>

                    :   <Container className={styles.noFavCont}>
                            <CircularProgress className={styles.progress}></CircularProgress>
                        </Container>

                : <Container className={styles.noFavCont}>
                        <Typography className={styles.noFav}
                                    align="center"
                                    variant="h6"
                        >No favorites yet</Typography>
                  </Container>
                }

                <Button className={styles.allFavButton}
                        component={Link}
                        to="/rwc/favorites"
                >All favorites 
                    <Arrow/>
                </Button>

            </Container>

            <Container maxWidth="sm"
                       className={styles.searchContainer}>

                <Typography className={styles.subtitle}
                            variant="h6"
                >Search locations</Typography>

                <Typography className={styles.searchHelpText}
                >Search for a location. Location names in finnish, eg. "Tie 7" or "Helsinki"</Typography>

                <form onSubmit={formHandler}>
                    <TextField variant="outlined"
                               size="small"
                               onChange={ (e) => {setUserInput(e.target.value)}}
                               error={Boolean(inputError)}
                               helperText={inputError}
                               className={styles.searchField}
                    ></TextField>

                    <Button variant="contained"
                            color="primary"
                            type="submit"
                            className={styles.searchButton}
                    >Search</Button>

                </form>

                { (props.latestInput.input)
                    ?            <Typography className={styles.searchHelpText2}
                                >Search results for: {props.latestInput.input}</Typography>
                    :           ""
                }

                <Container className={styles.resultContainer}>

                    <List>

                    {   searchResultList.map( (data, idx) => {

                        return(

                        <ListItem key={idx}
                                  className={styles.listItem}>
                            <ListItemText primary={data.stationName}>

                            </ListItemText>

                            <IconButton component={Link}
                                        to={`/rwc/viewimage/${data.stationId}/1`}>
                                <Arrow color="primary"></Arrow>
                            </IconButton>

                            <IconButton onClick={() => {props.addFavorite(data.stationId)}}>
                                <Favorite color="primary"></Favorite>
                            </IconButton>

                        </ListItem>);
                    })}

                    </List>
                </Container>

            </Container>
            
            { (connError) 
                ? <Typography align="center" 
                              variant="h6" 
                              className={styles.errorText}
                >{connError}</Typography>
                : ""
            }
            
        </Container>
    );

}