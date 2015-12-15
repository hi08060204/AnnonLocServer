# AnnonLocServer

## API

1. Get nearby locations    
   * GET http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations
2. Get comments by locations_id 
   * GET http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations/id
3. Post comments to locations
   * POST http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations/id
   * parameter : text, name, icon_url 
4. Get random Name and URL
   * GET  http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/randomId
5. Create new location
   * POST http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations
