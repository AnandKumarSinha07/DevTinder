DevTinder Api

## AuthRouter
-POST/signup
-POST/Login
-POST/Logout

## ProfileRouter
-GET/Profile/view
-PATCH/Profile/edit
-PATCH/Password
-DELETE/Profile


## ConnectionRouter
-POST/request/send/interested
-POST/request/send/ignored
-POST /request/review/accepted/requestId
-POST /request/review/rejected/requestId


## UserFeedRouter
--GET/user/feedsections 
--GET/Allrequest
-status ignore/interested,accepted,rejected

-- Logout logic

first we will check whether the user is valid so that he can Logout
after since login we get a cookie through that cookie we can get any specefic Api
now since the user is loged out we have to remove the cookie so that next time he login again 
again new cookie will be generated


-- profile update

first authentication of user we can check if the user is valid or not
after that if user is valid we are going to take out firstname last name 


--POST API VS GET API THOUGHT PROCESS
--read about ref and populate
--craete a get api for all the request/user/received
--all check







