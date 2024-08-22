==> **State Management:**
    State Management with React Context. 
    
    The App has the user check the user login status while using our App. The app will not allow users to use certain functions if they do not log in/sign up. It will pop an alert to direct the user to the log-in page.
    If the user is not logged in, the user will be set as null. This is how the App handles our authentication part to create the difference between the temp user and the logged-in user. 

    The other state management component is language. The App can switch the language on the Settings screen. Currently, the App has two languages (English/Simplified Chinese). Once the state language changes, almost all the text will switch to 
    a different language for users. The App has two languages for in-app text, alerts, and buttons. 
    
**Iteration-2:**

_Current state (or functionalities) of the application:_

==> **Features included/completed:**

    Location: An interactive map with Multiple markers for locations of the available listings (plus the user's location)

    Camera: User can take or upload photos while posting a new listing. Storing image uris in firestore, and displaying the images in PostListing(Create), PostListing(Edit), ScheduleVisit(Create), ScheduleVisit(Edit) screens.

    Notification: User can opt for a notification 1 day before the user's schedule (using local notification)

    External API: In HouseDetails screen, using an external API to show walking/ biking/ transit score of the location of the listing.


==> Apart from the listed features from the requirements for iteration-2, currently Login-SignUp validation and 'Forgot password' functionalities are implemented. However, some functionalities related to reading data by user id are pending, therefore 'Authentication' is not completed for iteration-2.


==> Current high-level data model:

    Listing: location, latitude, longitude, price, bed, bath, area, petFriendly(?), transit (options), type (shared/private), year (of construction), (preferred) tenant gender, imageUris, 

    User: email, name, phoneNumber (password will be stored and handled by firestore)

    ScheduledVisit: date, time, questions, setReminder(?), listingId, listingLocation, listingPrice

    saved: A {Listing} object

    
==> 4 collections in firestore: User, ScheduledVisits (a subcollection of User), Saved (a subcollection of User), Listing

     User collection: Add doc (C) after a new user registration

     ScheduledVisits collection: Add doc (C) after scheduling a visit, Read (R) for Scheduled Visits page

     Saved collection: Add doc(C) after saving a listing, Read(R) saved listing, Delete(D) listing from the saved collection

     Listing collection: Add doc (R) after posting a listing, Read(R) listing for 'Home', 'HouseDetails', 'My Posted listings' screens, Edit(U) for Edit listing option from 'My posted listings' screens, Delete(D) for deleting the listing from 'My Posted listings' or the 'Saved' screen.

 
==> The listed above is an addition to iteration-1. Therefore all the functionalities from iteration-1 are included.
<br>

**_Zhecheng Li's work in Iteration-2:_**
<br>
![Capture_Iteration2_0](https://github.com/user-attachments/assets/202abccc-ec03-4d2c-9c47-c6a119f4b41c)
![Capture_Iteration2_1](https://github.com/user-attachments/assets/e7c5f9e4-0ce2-45be-bde9-2197b5ef8855)
![Capture_Iteration2_2](https://github.com/user-attachments/assets/9019d5ca-2f20-45c7-aa75-902895857af3)

Updated the login and sign-up screen with a description. User can use forget password button to reset their password. 
<br>
![Capture_Iteration2_5](https://github.com/user-attachments/assets/da5d9693-2912-434b-848c-5dd0707258c6)
<br>
In sign up screen, user cannot create too simple password(must contain number+letter)
<br>
![Capture_Iteration2_3](https://github.com/user-attachments/assets/b066c846-af8f-42ec-9a0c-6d90ec3b95f3)
<br>
On the detailed page, the user can view the details with external API to show the walking score, biking score, and transit score. 
<br>
![Capture_Iteration2_4](https://github.com/user-attachments/assets/c5e9710f-2859-42c1-943d-bb0a9a25713d)

Create the notification 1 day before the user's schedule (local notification)

<br>
<br>

**_Savan Parmar - Iteration-2:_**
<br>
Asking user's permission for Location through a click on the Map area in the Home screen:
![Location_Permission](https://github.com/user-attachments/assets/7cd16bd5-fefc-44d2-b29f-f6f0344b273e)

When Permission is given, an interactive Map with locations of available listings are displayed with multiple markers and custom icon (along with the user's location):
![Map_all_mutliple](https://github.com/user-attachments/assets/f54a3eba-92aa-415f-b8bb-c0915be4797d)

Zoomed in (interactive) screen of an area:
![Map_multiple](https://github.com/user-attachments/assets/40ec19e0-91b1-4964-b1f4-3d9a000c491e)

Listing price as titles of their markers on the map (clcking on marker takes the user to HouseDetail of the clicked listing):
![Map_Listing_Title](https://github.com/user-attachments/assets/6623d8f9-19e1-48a8-adbd-ed449dca399f)
![Map_marker_title](https://github.com/user-attachments/assets/fb2eb05b-b025-435b-8851-f9daf176b452)

Displaying images as user takes/upload photos while posting a new listing:
![PostListing_Create](https://github.com/user-attachments/assets/39ec974e-e095-48a2-afe9-23a09d8296df)


Displaying existing images of the listing (with options to take/uplaod additional images) while editing a listed posted by user
![PostListing_Edit](https://github.com/user-attachments/assets/53e419d5-834b-49ff-99bb-f8c07cc38b51)


Displaying existing images of the listing while scheduling a new visit:
![ScheduleVisit_Create](https://github.com/user-attachments/assets/4d6e2263-abc9-430a-84c2-b370af10e6bf)


Displaying existing images of the listing while editing a scheduled visit:
![Schedule_Visit_Edit](https://github.com/user-attachments/assets/2f1e301f-1e31-4deb-838b-870b2f51e570)


<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

**Iteration-1:**

_Current state (or functionalities) of the application:_

==> 9 screens and other reusable components


==> Navigations between screens


==> Firebase configured


==> Current high-level data model:

    Listing: location, price, bed, bath, area, petFriendly(?), transit (options), type (shared/private), year (of construction), (preferred) tenant gender, imageUri

    User: email (password will be stored and handled by firestore)

    ScheduledVisit: date, time, questions, setReminder(?), listingLocation, listingPrice

    
==> 3 collections in firestore: User, ScheduledVisits (a subcollection of User), Listing

     User collection: Add doc (C) after a new user registration

     ScheduledVisits collection: Add doc (C) after scheduling a visit, Read (R) for Scheduled Visits page

     Listing collection: Add doc (R) after posting a listing, Read(R) listing for 'Home', 'HouseDetails', 'My Posted listings' screens, Edit(U) for Edit listing option from 'My posted listings' screens, Delete(D) for deleting the listing from 'My Posted listings' or the 'Saved' screen.

     

==> CRUD using firestore


==> User can login/signup, check details of a listing,  post a listing, checkout their posted listings,save listing, checkout the saved listings, schedule a visit to a listing, checkout the scheduled visits.








**_Zhecheng Li's work in Iteration-1:_**
![IMG_0643](https://github.com/user-attachments/assets/2b885339-fc7a-4e63-8c0a-8d9201c2ff73)
![IMG_0647](https://github.com/user-attachments/assets/bc8a12ae-7f7c-4ba2-b8d7-cf5788941af6)
Home Screen with Search and Filter function. Showing on listing from database
![IMG_0644](https://github.com/user-attachments/assets/8d5ab284-54ba-43c2-95fa-4fb9a83b766e)
Detail page for each Listing 
![IMG_0645](https://github.com/user-attachments/assets/a9b3d3dd-6856-4537-8744-bb2c779f60a5)
Profile Layout 

![IMG_0646](https://github.com/user-attachments/assets/04ba1bc1-4d60-47fc-b3dc-8d5e25a1bd6b)

Saved List for each indivual user, users can delete what he saved here

**_Savan Parmar - Iteration-1:_**
Login screen with email and password:
![Screenshot_20240807_222054_Expo Go](https://github.com/user-attachments/assets/33f4feec-a775-4718-a568-a72d226d8abe)

SignUp screen with email and password, when a user is registered, a new doc is created in 'User' collection in firebase.
![Screenshot_20240807_222115_Expo Go](https://github.com/user-attachments/assets/52110aa8-d018-407f-ac2a-ec2cedb7f318)

Post a listing screen. 
Create (C) operation in firestore: User can post take image, fill necessary data in this screen. Pressing Cancel navigates back to 'Profile' screen. Pressing 'Save' creates a new doc for listing in 'Listing' collection in firebase.
Edit (U) operation in firestore: Re-using Post a listing screen when navigated from 'Edit' option in 'My posted listings' screen.
![Screenshot_20240807_221947_Expo Go](https://github.com/user-attachments/assets/40d70537-6150-4113-8a86-a8a24c11ed2d)

'My Posted listings' screen. Fetching listings from firebase (Read (R) operation). Option to Edit(U) will redirect to Post a listing since we are re-using it. Option to Delete (D) deletes the listing from firestore.
![Screenshot_20240807_222014_Expo Go](https://github.com/user-attachments/assets/e24db69c-2053-4dad-a0d4-b03f76c202a8)

 
Schedule a visit screen (Navigated from HouseDetails screen), creating a visit doc(C) in 'ScheduledVisits' collection after successful submit.
![Screenshot_20240807_222115_Expo Go](https://github.com/user-attachments/assets/11ac2127-7895-4819-ac4e-2c182f6d70e8)
![Screenshot_20240807_222804_Expo Go](https://github.com/user-attachments/assets/a592d57d-c3cf-472b-a65e-fc5b0695d3b0)
![Screenshot_20240807_222327_Expo Go](https://github.com/user-attachments/assets/4e6df0a6-7283-4f44-a854-9846d8729c16)

'My scheduled visits' screen. Fetching visits from firebase (Read (R) operation)
![Screenshot_20240807_224014_Expo Go](https://github.com/user-attachments/assets/cee37a3e-6d81-4dde-8dc0-83238a3436b6)



