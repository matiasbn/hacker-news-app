import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const deleteElement = async (setStories, story) => {
  const { story_id } = story;
  await axios({ method: 'post', url: 'http://localhost:3001/delete', data: { storyId: story_id } });
  setStories((oldList) => oldList.filter((item) => item.story_id !== story_id));
};

export default function InteractiveList() {
  const classes = useStyles();
  const [dense] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios({ method: 'get', url: 'http://localhost:3001/fetch' });
      setStories(data);
    };
    fetchData();
  }, []);


  return (
    <div className={classes.root}>
      <Grid item xs={12} md={6} lg={12}>
        <Typography variant="h2" className={classes.title}>
          HN Feed
        </Typography>
        <Typography variant="h3" className={classes.title}>
          {'We <3 hacker news'}
        </Typography>
        <div className={classes.demo}>
          <List dense={dense}>
            {stories.map((story) => (
              <ListItem alignItems="flex-start" key={story.story_id}>
                <ListItemText
                  primary={story.story_title}
                  secondary={story.author}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteElement(setStories, story)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>
    </div>
  );
}
