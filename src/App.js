import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() { 
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  //useeffect -> Runs a specific code based on a specific condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }else{
        //use has logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    // this is where code runs
    db.collection('posts').orderBy('timestamp','desc' ).onSnapshot(snapshot => {

      //every time a new post is added, this code fired
      setPost(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })     
    
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((err) => alert(err.message));

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message))

    setOpenSignIn(false);
  }
  
  return (
    <div className="App">     

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
          <center>
            <img className="app-header-image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
          </center>
            <Input 
              placeholder="username" 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email" 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
          <center>
            <img className="app-header-image" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
          </center>            
            <Input 
              placeholder="email" 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      
      <div className="app-header">
        <img className="app-header-img" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>

        {user ? (<Button onClick={() => auth.signOut()}>Logout</Button>)
      : 
      (<div className="app-loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
      )}             
      </div>
      { user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ): (
          <h3 className="ask-login">Sorry, You need to Log In to Post</h3>
        )
    }

      <div className="posts">
        <div className="post-left">
          {
            posts.map( ({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageurl={post.imageurl} />
            ))
          }     
        </div>
        <div className="post-right">
        <InstagramEmbed
          url='https://www.instagram.com/p/CK_MyEjJYvE/'
          clientAccessToken='580578996232146|7acf90478931eaae0ce53cfaa1b11980'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div>
      </div> 

     
      
    </div>
  );
}

export default App;
