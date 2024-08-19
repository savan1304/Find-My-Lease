import { addDoc, collection, deleteDoc, doc, updateDoc, getDocs, query, where, setDoc, getDoc } from "firebase/firestore";
import { database } from "./firebaseSetup";

export async function writeToDB(data, collectionName) {
    try {
        const docRef = await addDoc(collection(database, collectionName), data);
        console.log(`Document written with ID: ${docRef.id}`);
    } catch (error) {
        console.log("Error in writing to db", error);
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

export async function editToDB(id, data, collectionName) {
    try {
        const docRef = doc(database, collectionName, id);
        await setDoc(docRef, data, { merge: true });
        console.log(`Document with ID ${id} has been updated.`);
    } catch (error) {
        console.log("Error in editing the document", error);
    }

}


export async function getDataById(id, collectionName) {
    let data = {}
    try {
        const docRef = doc(database, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            data = docSnap.data()
        }
        return data
    } catch (error) {
        console.log("Error in getDataById: ", error)
    }
}

export async function getVisitDataById(visitId, userId) {
    let visitData = {}
    try {
        const userDocRef = doc(database, "User", userId);
        const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
        const visitDocRef = doc(visitSubcollectionRef, visitId);
        const docSnap = await getDoc(visitDocRef);

        if (docSnap.exists()) {
            visitData = docSnap.data();
        }
        return visitData
    } catch (error) {
        console.log("Error in getVisitDataById: ", error)
    }
}

export function getVisitDocRefById(visitId, userId) {
    try {
        const userDocRef = doc(database, "User", userId);
        const visitSubcollectionRef = collection(userDocRef, "ScheduledVisits");
        const visitDocRef = doc(visitSubcollectionRef, visitId);
        return visitDocRef
    } catch (error) {
        console.log("Error in getVisitDocRefById: ", error)
    }
}