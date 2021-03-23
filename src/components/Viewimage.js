import { useParams } from 'react-router-dom';
import { Container, List, ListItem, Typography, IconButton, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack, Favorite } from '@material-ui/icons/';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { parseISO, isAfter, sub, format } from 'date-fns';

const useStyles = makeStyles({
    mainContainer :     { marginLeft : "180px",
                          paddingTop : "30px" },
    cameraImage :       { maxWidth : "720px",
                          maxHeight : "580px"},
    backButton :        { marginLeft : "15px"},
    favoriteButton :    { marginLeft : "600px"},
    title :             { marginLeft : "30px",
                          marginTop : "20px"},
    updatedText :       { fontSize : "12px",
                          marginBottom : "5px"},
    picDiv :            { maxWidth : "740px" }
});

export default function Viewimage(props){

    const styles = useStyles();
    const history = useHistory();
    
    const { stationId } = useParams();
    const { fromView } = useParams();
    
    const [cameraUrls, setCameraUrls] = useState([]);
    const [title, setTitle] = useState();

    const updateTitle = () => {
        props.stationList.forEach( (station) => {
            if (station.stationId === Number(stationId)) {
                setTitle(station.stationName);
            }
        });
    }

    const updateCameraUrls = () => {

        let thisLocationCameras = props.cameraData.cameraStations.filter( (data) => {
            return (Number(data.nearestWeatherStationId) === Number(stationId));
        });
    
        let cameraUrls = [];
        let comparisonDate = sub(new Date(), { months : 2 });

        thisLocationCameras.forEach( (data) => {
            data.cameraPresets.forEach( (camera) => {

                if (isAfter(parseISO(camera.measuredTime), comparisonDate)) {
                    cameraUrls = [...cameraUrls, {url : camera.imageUrl, 
                                                  updated : camera.measuredTime}];
                }

            });
        });
    
        setCameraUrls(cameraUrls);
    }

    const backButtonHandler = () => {

        if (Number(fromView) === 2) {
            history.push("/rwc/favorites");
        } else {
            props.setLatestInput({...props.latestInput, fromView : true});
            history.push("/rwc/search");
        }
    }

    useEffect( () => {
        updateTitle();
        updateCameraUrls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [] );

    return (
        <Container maxWidth="md"
                   className={styles.mainContainer}>

            <Button onClick={backButtonHandler}
                    className={styles.backButton}>
                <ArrowBack color="primary"/>
            Back</Button>

            { (Number(fromView) === 2)
            ?           ""  
            :           <IconButton className={styles.favoriteButton}
                                    onClick={ () => { props.addFavorite(stationId) }}>
                            <Favorite color="primary"/>
                        </IconButton>
            }     

            <Typography variant="h6"
                        className={styles.title}
            >{title}</Typography> 

            <List>
            {   cameraUrls.map( (cam) => {

                return(
                    <ListItem key={cam.url}>
                        <div className={styles.picDiv}>

                            <img className={styles.cameraImage} 
                                 src={cam.url} alt="Road"/>

                            <Typography className={styles.updatedText}
                                        align="left"
                            >Updated: {format(parseISO(cam.updated),"d.M.yyyy HH.mm")}</Typography>

                        </div>
                    </ListItem>
                );
            })}
            </List>


        </Container>
    );
    
}