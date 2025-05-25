This Project was created using next.js alongside neon postgres serverless database, continuous integration with github actions. stripe transactions API system and deployed on vercel applications for continuous delivery.

# Ecommerce Project
This simple custom made Ecommerce project looks to serve the community on amazing products ranging from entertainment to needs.

#SET UP INSTRUCTIONS

1. Create accounts for Vercel, stripe, neon postgres and github.
2. Create a yaml file in the project and customise your own  CI pipeline and connect and create a workflow with github actions with variables.
3. Connect secret variables from Stripe and neon postgres in .env file to access for the project.
4. Create a endpoint for the stripe webhook to listen to for transactions.
5. Apply all variables and settings through vercel and deploy the application.

#Important Notes: 
The current Tailwind version is being using is 3.4, not the latest if you decide to use the latest tailwind versions, there could be issues with the flow-bite UI library being used in this project.

Zustand is being used for global state mangagement for this project, and not the react.js context library.



