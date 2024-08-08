Application name: FindMyLease
Contributors:
1. Zhecheng Li
2. Savan Parmar

Current state:
==> 6 screens: SignUp, Login, Home, Messages, Profile, PostedListings
==> Navigation between the screens
==> 3 collections in firestore: Listing, User, ScheduledVisits (a subcollection of User)
==> Functional CRUD operations: 
    Post (C) listing from "Post a Listing" screen. It will create a new doc in 'Listing' collection in firestore
    Fetch (R) listing from "My Posted Listings" option or "Home" screen.
    Edit (U) listing from the edit option in "My Posted Listings" screen. It uses the Post a listing screen with populated data and will update the listing data in firestore accordingly after saving the changes.
    Delete (D) listing from the the delete option in "My Posted Listings" screen, deletes the listing in firestore.

==> The collections in firestore:
    When a listing is created from "Post a Listing" page, a doc is listing added to 'Listing' collection
    When a new user registers, a doc for user is added to 'User' collection
    When the user schedules a visit from "Schedule a Visit" screen, a doc for scheduled visit is added to 'ScheduledVisits' subcollection in 'User' collection.


    


