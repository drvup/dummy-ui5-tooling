# Template CIT001
## Template shortcuts
* UI5 webapp
* ui5-tooling as main dependency
* MTA
* Will be deployed into HTML5-Repository on CF

## Template description
This repository is a demo repository to use SAP ui5-tooling module, a ui5.yaml file to define the libraries and middlewares for local development and a mta.yaml to deploy into a (fresh) HTML5-Repository service instance on a Cloud Foundry environment.  
The UI5.yaml is using 'i5-task-zipper' to create a webapp.zip file containing all necessary files of the webapp folder, within the xs-app.json. This file will be picked up by the MTA.yaml build step and used as source for the target MTA.
In this scenario we're deploying the MTA into a HTML5-Service-Instance, hosted on Cloud Foundry.  
So there will not any application appear after successfull deployment, as the webapp will be hosten inside the HTML5-Service instance.  

## Requirements
* Install the devDependencies defined inside 'package.json' (by using npm install) on your device
* On your target Cloud Foundry Environment you will need a subscription to HTML5 Services
* On your target Cloud Foundry Environment you're required to install any kind of application router (e.g. FLP, your own approuter,.. ) and bind this app router within a HTML5-Run service instance, to access the repositories storred on the HTML5-Repo-Service-Instance.

## Contact and Credits
Please check licences for each npm module on your own, before using it on your production.  
Come back to us, if you need guidance or more information about it.  
CIT Focus EG  
www.cit-focus.com   