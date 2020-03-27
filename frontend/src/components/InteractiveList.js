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
import day from 'dayjs';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    width: '100%',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  date: {
    alignContent: 'right',
  },
}));

const formatDate = (date) => {
  // Multiplying by 1000 to pass to milliseconds
  const storyDate = day(date * 1000);
  const currentDate = day();
  const storyDay = storyDate.startOf('day').unix();
  const currentDay = currentDate.startOf('day').unix();
  const yesterday = currentDate.subtract(1, 'day').startOf('day').unix();
  if (storyDay === currentDay) return storyDate.format('HH:mm');
  if (storyDay === yesterday) return 'Yesterday';
  return storyDate.format('MMM DD');
};

const deleteElement = async (setStories, story, setSelectedIndex) => {
  const { story_id } = story;
  await axios({ method: 'post', url: 'http://localhost:3001/delete', data: { storyId: story_id } });
  setStories((oldList) => oldList.filter((item) => item.story_id !== story_id));
  setSelectedIndex(null);
};

export default function InteractiveList() {
  const classes = useStyles();
  const [dense] = useState(false);
  const [stories, setStories] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();

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
          <List dense={dense} component="nav">
            {stories.map((story, index) => (
              <ListItem
                button
                alignItems="flex-start"
                key={story.story_id}
                selected={selectedIndex === index}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => window.open(story.story_url, '_blank')}
              >
                <ListItemText
                  primary={story.story_title}
                  secondary={story.author}
                />
                <ListItemText
                  className={classes.date}
                  primary={formatDate(story.created_at_i)}
                />
                <ListItemSecondaryAction>
                  {selectedIndex === index
                   && (
                   <IconButton edge="end" aria-label="delete" onClick={() => deleteElement(setStories, story, setSelectedIndex)}>
                     <DeleteIcon />
                   </IconButton>
                   )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>
    </div>
  );
}
