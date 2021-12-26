# MSc Computer Science - Dissertation Project
 
<hr/>

<p align="center">
  <img src="./images/project_dashboard.PNG" width="850" title="project dashboard">
</p>

<hr/>

* `This repository does not have a license. EDUCATION USE ONLY`

* <strike>This application use Pinata for IPFS File, create a .env file and add the keys.</strike>

* File storage was moved to Ipfs Infura using ipfs-http-client.
* The files stored in IPFS are public. The security of the files is not important, they represent mainly public project files. (For a security approach - the files can be encrypted before pinning it to the IPFS Service)

<hr/>

* Features
  * Users Manager
      * Create, List, Change User Role
      * Sign Transaction with Private Key
      * Verify Signature Transaction
      * Check Private Key before signing the transaction
      * Functionalities available only for the Admin
  * Projects Manager
      * Create, List, Change Project File
      * Create, List Projects Requests
      * Sign Transaction with Private Key
      * Verify Signature Transaction
      * Check Private Key before signing the transaction
      * Get only the Projects signed by the currently logged user
  * Supervisors Manager
      * Approve or Reject Project Request
      * Sign Transaction with Private Key
      * Verify Signature Transaction
      * Check Private Key before signing the transaction
  * Companies Manager
      * Approve or Reject Project Request
      * Sign Transaction with Private Key
      * Verify Signature Transaction
      * Check Private Key before signing the transaction
      * List only the projects signed by the company 
  * Requests Manager
      * See all the projects requests

  * Safely work with Private Key without storing it
  * Only authorized users have access to the application
  * Show the traceability of a request, project, user (shows all the modifications made with the related entities)
  * Show the status of a project with additional information
  * Using IPFS to store the project details (file storage)
