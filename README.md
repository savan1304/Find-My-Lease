Video Demo: https://www.youtube.com/watch?v=k0f0aWqtg1M
<br>
**Iteration-3:**

_Current state (or functionalities) of the application:_

==> **Features included/completed:**
<br>

**Authentication**: 
Users can log in or sign up in our App. The app has instruction text to help users understand what this App does. During sign-up, the password cannot be too simple(must be letter+number). In log-in page, User can reset their password if they forget.
With State Management, Users cannot access certain functions if they do not log into the App. However, temp users still can view the listings. User can see their profile page with their contact information, and they can edit their information. Users cannot edit the listing that was posted by other users, and they cannot check the personal info of other users. 
<br>
<br>
**State Management:**
    State Management with React Context. 
    
    The App has the user check the user login status while using our App. The app will not allow users to use certain functions if they do not log in/sign up. It will pop an alert to direct the user to the log-in page.
    If the user is not logged in, the user will be set as null. This is how the App handles our authentication part to create the difference between the temp user and the logged-in user. 
<br>
<br>

**Language:**
    The other state management component is language. The App can switch the language on the Settings screen. Currently, the App has two languages (English/Simplified Chinese). Once the state language changes, almost all the text will switch to a different language for users. The App has two languages for in-app text, alerts, and buttons. 
<br>
<br>

**VisitRequests:**
After potential tenant (visit-requester) schedules a visit, the status of their visit request 'pending' will be displayed in ScheduledVisits screen with Contact landlord option.
<br>
The landlord can see the visit request details from PostedListings screen using the 'Visit Requests: ' button with counter. After pressing on it, the details of all visit requests for that listing will displayed with options to Approve or Reschedule them. If they reschedule a visit request, the details of reschedule date and time with initial reschedule response as 'Pending' will be displayed to the landlord.
<br>
After landlord requests a reschedule, the visit-requester will see their visit status as 'Rescheduled' in ScheduledVisits with an option to Accept it and the details of reschedule date and time. If they accept the reschedule date and time, the date and time of the visit is updated to the reschedule date and time. And the landlord can see the reschedule response as 'Accepted'.
<br>
Additional scenarios are handled regarding this feature, which can be seen in the screenshots below.
<br>
<br>

**Delete account:**
User can Delete their account from Profile screen. Asking for their password as confirmation and for reauthentication.
<br>
<br>

==> Current high-level data model:

    Listing: location, latitude, longitude, price, bed, bath, area, petFriendly(?), transit (options), type (shared/private), year (of construction), (preferred) tenant gender, imageUris, visitRequests (of visit objects), createdBy (a user id)

    User: email, name, phoneNumber (password will be stored and handled by firestore)

    ScheduledVisits: date, time, questions, setReminder(?), listingId, listingLocation, listingPrice, status, requester (a user id), rescheduleDate, rescheduleTime, rescheduleResponse, 

    saved: A {Listing} object

    
==> 4 collections in firestore: User, ScheduledVisits (a subcollection of User), Saved (a subcollection of User), Listing

     User collection: Add doc (C) after a new user registration

     ScheduledVisits collection: Add doc (C) after scheduling a visit, Read (R) for Scheduled Visits page, Read (R) and Update (E) for VisitRequests

     Saved collection: Add doc(C) after saving a listing, Read(R) saved listing, Delete(D) listing from the saved collection

     Listing collection: Add doc (R) after posting a listing, Read(R) listing for 'Home', 'HouseDetails', 'My Posted listings' screens, Edit(U) for Edit listing option from 'My posted listings' screens, Delete(D) for deleting the listing from 'My Posted listings' or the 'Saved' screen. Read (R) and Update (E) for VisitRequests

 
==> The listed above is an addition to iteration-1 and iteratioin-2. Therefore all the functionalities from iteration-1 and iteration-2 are included.
<br>
<br>
**_Zhecheng Li's work in Iteration-3:_**
<br>
![IMG_0686](https://github.com/user-attachments/assets/cc65d62a-0ad7-47fe-abbc-a4f364604bbc)

Allow users to check the contact information of the landlord. Use Clipboard so they can hold and copy.
<br>
![IMG_0685](https://github.com/user-attachments/assets/10981f09-d172-4e92-b002-673f0b6f5e47)

Temp Users will not access certain functions, they have to log in first.
<br>
![IMG_0684](https://github.com/user-attachments/assets/b6b88a31-b91a-4fa1-ae42-cce337da2fc9)

The search bar can filter with the location. 
<br>
![IMG_0678](https://github.com/user-attachments/assets/46fcc860-6997-448f-a524-812d84e6dc46)
![IMG_0679](https://github.com/user-attachments/assets/ba6ce0c3-962a-4480-8ccd-32b262924310)

Updated profile page, move the saved part into the bottom tab. Updated the layout and rule for the saved part. 
<br>
![IMG_0680](https://github.com/user-attachments/assets/b3041fba-5847-49ed-b72b-5d9ddd28fc0d)

User can cancel all the local notification with top right button
<br>
![IMG_0682](https://github.com/user-attachments/assets/0a203dd4-bfe2-443f-90e8-8deb6141cf5d)
![IMG_0683](https://github.com/user-attachments/assets/e88a1c72-d456-4641-beab-b5b08e7caf5c)

Add the Chinese language to our App. Users can switch different languages in the App. The picture only shows the Chinese in the profile page, but it works on all the App. 

<br>
<br>
<br>

**_Savan Parmar - Iteration-2:_**
<br>
Confirm alert while scheduling/editing a visit:
![VisitRequest_scheduleVisit_save_alert](https://github.com/user-attachments/assets/0d8767d3-e471-48d2-b5fe-e41c232e4f9b)

<br>

ScheduledVisit initial screen for visit-requester after scheduling the visit:
![VisitRequest_scheduledVisit_initial_Detail](https://github.com/user-attachments/assets/265b8d8b-c90c-4b54-a192-fa80ddc934e9)

<br>

PostedListings with counter and VisitRequests initial screens for landlord after a visit is scheduled:
![VisitRequest_landlord_counter](https://github.com/user-attachments/assets/e075d0c9-e3bd-4e66-81c7-a23542219a8e)
![VisitRequest_landlord_initial_Details](https://github.com/user-attachments/assets/64d0d12e-31ec-49fd-a79f-52f2566e76e2)

<br>

VisitRequest normal approve and after approval for landlord:
![VisitRequest_landlord_normal_approve](https://github.com/user-attachments/assets/1f5e3f1c-c020-4b48-b184-9f32bd72668e)
![VisitRequest_landlord_approved](https://github.com/user-attachments/assets/d873e9db-5763-4794-9cd2-92b17a4c75c7)


<br>

VisitRequest if landlord attempts to reschedule at the same date and time as current:
![VisitRequest_landlord_same_date_and_time](https://github.com/user-attachments/assets/f20a3b59-4b1f-4dbc-bea3-1849d527d483)

<br>

VisitRequest after landlord reschedules the visit:
![VisitRequest_landlord_after_Reschedule](https://github.com/user-attachments/assets/579edc93-dac9-4a05-b2e9-ecd812e6ccb1)

<br>

ScheduledVisits for visit-requester after the visit is rescheduled:
![VisitRequest_visitRequester_after_Reschedule](https://github.com/user-attachments/assets/369d9aa9-36f3-4ee8-b89f-4bc6844aabe4)

<br>

ScheduledVisits is visit-requester accepts the reschedule request (visit date or time or both updated to reschedule date and time):
![VisitRequest_visitRequester_after_rescheduleResponse_Accepted](https://github.com/user-attachments/assets/7dda1229-152c-4557-8f21-f79af22555ad)

<br>

ScheduleVisits for visit-requester after pressing contact landlord option:
![VisitRequest_contact_landlord_options](https://github.com/user-attachments/assets/63b24a7b-2bff-47eb-adf0-94bbdaf0ef4b)
![VisitRequest_visitRequester_call_landlord](https://github.com/user-attachments/assets/d6c83b2d-a048-4bcd-8aaf-ca67af021976)
![VisitRequest_visitRequester_email_landlord](https://github.com/user-attachments/assets/748243a4-7d09-4d75-905b-adff4759ed03)

<br>

VisitRequests for landlord after visit-requester accepts the reschedule request: (date and time of the visit is updated to reschedule date and time):
![VisitRequest_landlord_rescheduleResponse_accepted](https://github.com/user-attachments/assets/2d07c19a-0ff9-4970-a782-c5118514c957)

<br>

VisitRequest approve alert for landlord if reschedule request is not accepted by visit-requester yet:
![VisitRequest_landlord_approval_without_rescheduleResponse_accepted](https://github.com/user-attachments/assets/3cbf23c3-ef73-4ea3-9bd5-fe95b0742d09)

<br>

Delete account modal after 'Delete Account' is pressed from Profile screen:
![DeleteAccount_initial_warning](https://github.com/user-attachments/assets/5c006e06-53d8-4fc0-b1f5-98584c0726eb)


<br>

Delete account after user press proceed, asking user to enter the password for confirmation:
![DeleteAccount_enter_password](https://github.com/user-attachments/assets/12367ce7-1c6f-47ef-84ad-83701103a5de)


<br>

Delete account final confirmation:
![DeleteAccount_Final_confirmation](https://github.com/user-attachments/assets/126ff146-e6c2-4181-b532-c445a96bff3c)











<br>
<br>
<br>
<br>
<br>

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



