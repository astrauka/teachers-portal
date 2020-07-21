# End ot end tests

Trying out cypress for e2e tests.
They're not testing anything yet.
Need to login to the site without using the google login button
as it should not be tested using e2e. Thinking of the following approach:
* define custom endpoint to get logged in session token
* call the endpoint from the test to become logged in
* secure the endpoint with secret such that others cannot login with it
