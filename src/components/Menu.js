import { Drawer, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    listitem :  { marginTop : "10px" ,
                  color : "white" },
    list :      { paddingTop :"50px" },
    paper :     { backgroundColor : "#2196F3",
                  color : "white",
                  paddingTop : "30px",
                width : "170px" },
    title :     { marginTop : "0",
                  fontWeight : "bold" },
    subtitle :  { fontSize : "12px"}
});

export default function Menu(props){

    const styles = useStyles();

    return (      

        <Drawer variant="permanent"
                open={true}
                classes={{
                    paper : styles.paper
                }}>

            <Typography variant="h5"
                        align="center"
                        className={styles.title}
            >Road</Typography>

            <Typography variant="h5"
                        align="center"
                        className={styles.title}
            >Weather</Typography>

            <Typography variant="h5"
                        align="center"
                        className={styles.title}
            >Cameras</Typography>

            <Typography variant="body1"
                        align="center"
                        className={styles.subtitle}
            >Hannu Tätilä 2021</Typography>

            <List className={styles.list}>

                <ListItem component={Link}
                          to="/rwc/">
                    <ListItemText primary="Welcome" 
                                  primaryTypographyProps={{variant : "button", align : "right"}}
                                  className={styles.listitem}/>
                </ListItem>

                <ListItem component={Link}
                          to="/rwc/search">
                    <ListItemText primary="Search" 
                                  primaryTypographyProps={{variant : "button", align : "right"}}
                                  className={styles.listitem}/>
                </ListItem>

                <ListItem component={Link}
                          to="/rwc/favorites">
                    <ListItemText primary="Favorites"
                                  primaryTypographyProps={{variant : "button", align : "right"}} 
                                  className={styles.listitem}/>
                </ListItem>

            </List>

        </Drawer>);

}