import firebase from 'firebase/app'
import { useEffect, useState } from 'react';


const Channel = ({user = null, db = null}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const {uid, displayName, photoURL} = user;

    useEffect(() => {
        
        if (db) {
           
            const unsubscribe = db
                .collection('messages')
                .orderBy('createdAt')
                .limit(100)
                .onSnapshot(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                        

                    }));
                    
                    
                    setMessages(data);
                })
            return unsubscribe;
        }
        
    }, [db]);
    
    const handleOnChange = e => {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = e => {
        e.preventDefault();

        if (db) {
            db.collection("messages").add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                author: displayName,
                uid,
                displayName,
                photoURL
            })
        }
        setNewMessage('')
    }
    function split(author) {
        return author.split(" ")[0]
    }
    return (
        
        <>
            <ul>
                {messages.map(message => (
                    <li key = {message.id}>{split(message.author)}: {message.text}</li>
                ))}
            </ul>
            <form onSubmit = {handleOnSubmit}>
                <input type = "text" value = {newMessage} onChange = {handleOnChange} placeholder = "Type here..."/>
                <button class = "transparent" type = "submit" disabled = {!newMessage}><i id = "airplane" class="fa fa-paper-plane-o"></i></button>
                

            </form>
        </>
    );
} 

export default Channel;