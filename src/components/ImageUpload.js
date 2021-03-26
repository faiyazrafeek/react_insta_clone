import firebase from 'firebase';
import React, { useState } from 'react';
import {db,storage} from '../firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');


    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);        
        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                //progress function....
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error function...
                console.log(error);
                alert(error.message);
            },
            () => { 
                //complete function
                storage
                    .ref("images")                 
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside the db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageurl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }

    return (
        <>
        <div className="loader" style={{ width: `${progress}%` }}></div>
        <div className="image-upload-container">
           
            {/* <progress className="image-upload-progress" max="100" value={progress} /> */}
            <input type="text" className="post-caption" required placeholder="Enter a caption..." onChange={e => setCaption(e.target.value)} value={caption} />
            <input type="file" required onChange={handleChange} />
            <a className="image-upload-btn" onClick={handleUpload} href="#!">Upload</a>
        </div>
        </>
    )
}

export default ImageUpload
