import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    mainContainer :     { marginLeft : "180px",
                          paddingTop : "30px" },
    title :             { marginBottom : "30px"},
    infoText:           { marginTop : "20px"}
});

export default function Info(){

    const styles = useStyles();

    return (
        <Container maxWidth="md"
                   className={styles.mainContainer}>
            
            <Typography align="center" 
                        variant="h5"
                        className={styles.title}
            >Welcome to RWC</Typography>

            <Typography className={styles.infoText}>This service allows the user to search and view road weather camera images.
                The search function is a free text search in the name of the locations. 
                You can use, for example, road numbers or city names (or parts of) to search.
            </Typography>

            <Typography className={styles.infoText}>Locations can be saved to favorites by clicking the heart icon.  Favorites are stored in the 
                browser's local storage, so they will persist until the browser cache is cleared. Favorites can be removed from the favorites view
                or from the search view by clicking the trashcan icon.
            </Typography>

            <Typography className={styles.infoText}>Please note that city/municipality information in the location search is not exact,
                because many roads (road numbers) span across multiple municipalities. Also the location of the
                cameras is defined by the nearest weather station in the data, which is not always the same thing as
                the actual location of the camera. If you know a camera exists, but cannot find it with a city name, it might be possible
                to find with a road number.
            </Typography>

            <Typography className={styles.infoText}>This service is a study assignment, made using JS / React / Material UI.</Typography>
            <Typography className={styles.infoText}>Source of data Fintraffic / digitraffic.fi, license CC 4.0 BY</Typography>
            <Typography className={styles.infoText}>Hannu Tätilä, XAMK 2021</Typography>


        </Container>
    );

}