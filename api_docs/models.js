/** 
 * @swagger
 * components:
 *  schemas:
 *      Admin:
 *          type: object
 *          required:
 *              - id
 *              - uuid
 *              - username
 *              - email
 *          properties:
 *              id:
 *                  type: int
 *                  description: Id of the object, Auto generated and increased incremently
 *              created_at:
 *                  type: datetime
 *                  description: Datetime when object is created
 *              updated_at:
 *                  type: datetime
 *                  description: Datetime when object is updated
 *              deleted_at:
 *                  type: datetime
 *                  description: Datetime when object is soft deleted
 *              is_deleted:
 *                  type: bool
 *                  description: Flag for if this admin is soft deleted
 *              uuid:
 *                  type: UUID
 *                  description: UUID of the object, Auto generated
 *              username:
 *                  type: string
 *                  description: Inputted username of the Admin object
 *              email:
 *                  type: string
 *                  description: Inputted email of the Admin object
 *              is_active:
 *                  type: bool
 *                  description: Flag for if this admin is active, Default true
 *              phone_number:
 *                  type: string
 *                  description: Inputted phone_number of the Admin object
 *          example:
 *              id: 1
 *              created_at: 2023-06-11 15:28:42
 *              updated_at: 2023-06-11 15:28:42
 *              deleted_at: 2023-06-11 15:28:42
 *              is_deleted: false
 *              uuid: fd55defe-420e-4884-bd03-68d3e998b51b
 *              username: superadmin
 *              email: superadmin@yopmail.com
 *              is_active: true
 *              phone_number: 081312423435
 * 
 * @swagger
 * components:
 *  schemas:
 *      AdminCredentials:
 *          type: object
 *          required:
 *              - id
 *              - admin_id
 *              - password
 *              - salt
 *          properties:
 *              id:
 *                  type: int
 *                  description: Id of the object, Auto generated and increased incremently
 *              created_at:
 *                  type: datetime
 *                  description: Datetime when object is created
 *              updated_at:
 *                  type: datetime
 *                  description: Datetime when object is updated
 *              deleted_at:
 *                  type: datetime
 *                  description: Datetime when object is soft deleted
 *              is_deleted:
 *                  type: bool
 *                  description: Flag for if this admin is soft deleted
 *              admin_id:
 *                  type: int
 *                  description: Foreign key to id in admins table
 *              password:
 *                  type: string
 *                  description: Inputted password of which has been hashed
 *              salt:
 *                  type: bool
 *                  description: The salt used for hashing the password
 *          example:
 *              id: 1
 *              created_at: 2023-06-11 15:28:42
 *              updated_at: 2023-06-11 15:28:42
 *              deleted_at: 2023-06-11 15:28:42
 *              is_deleted: false
 *              admin_id: 1
 *              password: $2b$10$AfyYHpl5e69g7hriPUWlruBF6Zq1GPlhJkpEvEuHEP42vLBQnwX96
 *              salt: $2b$10$AfyYHpl5e69g7hriPUWlru
 * 
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - id
 *              - uuid
 *              - name
 *              - phone_number
 *          properties:
 *              id:
 *                  type: int
 *                  description: Id of the object, Auto generated and increased incremently
 *              created_at:
 *                  type: datetime
 *                  description: Datetime when object is created
 *              updated_at:
 *                  type: datetime
 *                  description: Datetime when object is updated
 *              deleted_at:
 *                  type: datetime
 *                  description: Datetime when object is soft deleted
 *              is_deleted:
 *                  type: bool
 *                  description: Flag for if this user is soft deleted
 *              uuid:
 *                  type: UUID
 *                  description: UUID of the object, Auto generated
 *              name:
 *                  type: string
 *                  description: Inputted name of the User object
 *              phone_number:
 *                  type: string
 *                  description: Inputted phone_number of the User object
 *          example:
 *              id: 1
 *              created_at: 2023-06-11 15:28:42
 *              updated_at: 2023-06-11 15:28:42
 *              deleted_at: 2023-06-11 15:28:42
 *              is_deleted: false
 *              uuid: fd55defe-420e-4884-bd03-68d3e998b51b
 *              name: user satu
 *              phone_number: 081312423435
 * 
 * @swagger
 * components:
 *  schemas:
 *      UserCredentials:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - password
 *              - salt
 *          properties:
 *              id:
 *                  type: int
 *                  description: Id of the object, Auto generated and increased incremently
 *              created_at:
 *                  type: datetime
 *                  description: Datetime when object is created
 *              updated_at:
 *                  type: datetime
 *                  description: Datetime when object is updated
 *              deleted_at:
 *                  type: datetime
 *                  description: Datetime when object is soft deleted
 *              is_deleted:
 *                  type: bool
 *                  description: Flag for if this admin is soft deleted
 *              user_id:
 *                  type: int
 *                  description: Foreign key to id in admins table
 *              password:
 *                  type: string
 *                  description: Inputted password of which has been hashed
 *              salt:
 *                  type: bool
 *                  description: The salt used for hashing the password
 *          example:
 *              id: 1
 *              created_at: 2023-06-11 15:28:42
 *              updated_at: 2023-06-11 15:28:42
 *              deleted_at: 2023-06-11 15:28:42
 *              is_deleted: false
 *              user_id: 1
 *              password: $2b$10$AfyYHpl5e69g7hriPUWlruBF6Zq1GPlhJkpEvEuHEP42vLBQnwX96
 *              salt: $2b$10$AfyYHpl5e69g7hriPUWlru
 */
