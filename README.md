## Shared documents API

### DB design

As fields design approach I chose tree structure. I see it as scalable, payload size for documents or fields in general won't be exceeded.

### Limitations

Document permissions are limited, as well as children for one field, but its a big value (16 mb size limit).
To get full extended data, multiple queries should be performed. Same applies to deletion of hanging fields.

### Data flow

- To each request should be applied mock user identification (X-User-ID):
  - It could be fetched from POST /users
- General flow:
  - Create field with type document, add/delete/update fields

#### There are flows, something may work incorrectly, but the general idea is implemented
