import { addDoc, collection, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import { database } from "./firebaseSetup";

export async function writeToDB(data, collectionName) {
    try {
        const docID = await addDoc(collection(database, collectionName), data)
        console.log(docID)
    } catch (error) {
        console.log("Error in writing to db", error)
    }

}

export async function deleteFromDB(id, collectionName) {
    try {
        await deleteDoc(doc(database, collectionName, id))
    } catch (error) {
        console.log("Error in Deleting from db", error)
    }
}


export async function readAllDocs(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(database, collectionName))
        let newArray = []
        if (!querySnapshot.empty) {
            querySnapshot.forEach((docSnapShot) => {
                console.log(docSnapShot.id)
                newArray.push({ ...docSnapShot.data(), id: docSnapShot.id })
            });
        }
        console.log("Query snashot array: ", newArray)
        return newArray
    } catch (err) {
        console.log(err)
    }
}

export async function createNewUser(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
        console.log(err)
    }
}

