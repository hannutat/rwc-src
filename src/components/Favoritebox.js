import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, IconButton } from '@material-ui/core';
import { Delete, KeyboardArrowRight as Arrow } from '@material-ui/icons';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    cameraImage :       { maxWidth : "120px",
                          maxHeight : "80px",
                          display : "block",
                          marginLeft : "auto",
                          marginRight : "auto"},
    cameraImgDiv :      { width : "150px",
                          position : "absolute",
                          top : "40px"},
    mainContainer :     { height : "180px",
                          maxWidth : "150px",
                          margin : "15px",
                          paddingTop : "5px",
                          paddingLeft : "0",
                          paddingRight : "0",
                          border : "1px solid lightgrey",
                          boxShadow : "3px 3px 3px lightgrey",
                          position : "relative"},
    stationTitle :      { fontSize : "11px",
                          maxWidth : "140px",
                          marginBottom : "5px",
                          maxHeight : "33px",
                          overflow : "hidden" },
    deleteButton :      { marginRight : "52px",
                          position : "absolute",
                          top : "130px",
                          left : "5" },
    viewButton :        { position : "absolute",
                          top : "130px",
                          left : "100px" }
});

export default function Favoritebox(props) {

    const styles = useStyles();

    const [cameraUrl, setCameraUrl] = useState([]);

    const updateCameraUrl = () => {

        if (props.loaded) {

            let thisLocationCameras = props.cameraData.cameraStations.filter( (data) => {
                return (Number(data.nearestWeatherStationId) === Number(props.station.stationId));
            });
            setCameraUrl(thisLocationCameras[0].cameraPresets[0].imageUrl);
        }
    }

    useEffect( () => {
        updateCameraUrl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect( () => {
        updateCameraUrl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loaded]);

    return (
        <Container className={styles.mainContainer} 
                   fixed>

            <Typography className={styles.stationTitle}
                        align="center"
            >{props.station.stationName}</Typography>
            
            <div className={styles.cameraImgDiv}>
                <img src={cameraUrl} 
                    className={styles.cameraImage} 
                    alt="Road"
                ></img>
            </div>

            <IconButton className={styles.deleteButton}
                        onClick={ () => {props.deleteFavorite(props.station.stationId)} }>
                <Delete color="primary"></Delete>
            </IconButton>

            <IconButton className={styles.viewButton}
                        component={Link}
                        to={`/rwc/viewimage/${props.station.stationId}/${props.fromView}`}>
                <Arrow color="primary"></Arrow>
            </IconButton>

        </Container>
    );
}