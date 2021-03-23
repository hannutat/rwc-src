import { Container, Typography, Grid, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Favoritebox from './Favoritebox';
import { Delete } from '@material-ui/icons';
import { useEffect } from 'react';

const useStyles = makeStyles({
    mainContainer :     { marginLeft : "180px",
                          paddingTop : "30px" ,
                          paddingRight : "18px"},
    title :             { marginBottom : "30px"},
    gridCont :          { borderRadius : "5px",
                          border : "1px solid lightgrey",
                          boxShadow : "3px 3px 3px lightgrey",
                          marginTop : "30px",
                          overflow : "auto",
                          minHeight : "212px"},
    noFav :             { marginTop : "80px"},
    noFavCont :         { borderRadius : "5px",
                          border : "1px solid lightgrey",
                          boxShadow : "3px 3px 3px lightgrey",
                          marginTop : "30px",
                          height : "212px" },
    deleteButton :      { marginTop : "10px",
                          float : "right" },
    progress :          { display : "block",
                          marginLeft : "auto",
                          marginRight : "auto",
                          marginTop : "80px"}
});

export default function Favorites(props){

    const styles = useStyles();

    const deleteButtonHandler = () => {
        props.deleteFavorite(1);
    }

    useEffect( () => {
        if (!props.stationList) {
            props.loadStationDataFromApi();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []); 

    return (
        <Container maxWidth="md"
                   className={styles.mainContainer}>

            <Typography align="center"
                        variant="h5"
                        className={styles.title}
            >Favorites</Typography>

            { (props.favorites.length > 0)

            ?   (props.loaded)
                
                ?   <Grid container
                            className={styles.gridCont}>
                        
                        { props.favorites.map( (station) => {
                            return (
                                <Favoritebox key={station.stationId} 
                                            cameraData={props.cameraData}
                                            deleteFavorite={props.deleteFavorite}
                                            station={station}
                                            fromView="2"
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

            <Button className={styles.deleteButton}
                    color="primary"
                    onClick={deleteButtonHandler}>
                <Delete/> Delete all favorites
            </Button>

        </Container>
    );

}