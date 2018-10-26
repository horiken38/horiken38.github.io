<a name="Response"></a>

## Response
**Kind**: global class  

* [Response](#Response)
    * [new Response(params)](#new_Response_new)
    * [.text()](#Response+text) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.json()](#Response+json) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_Response_new"></a>

### new Response(params)
Response class for SiRuClient


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | parameter |
| params.status | <code>number</code> | 200,404 etc. |
| params.method | <code>string</code> | "get", "post" etc |
| params.transaction_id | <code>number</code> | transaction id |
| params.text | <code>string</code> | response text |

<a name="Response+text"></a>

### response.text() ⇒ <code>Promise.&lt;string&gt;</code>
get response text

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;string&gt;</code> - response text  
<a name="Response+json"></a>

### response.json() ⇒ <code>Promise.&lt;Object&gt;</code>
get response in json object

**Kind**: instance method of [<code>Response</code>](#Response)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - response in json object  
