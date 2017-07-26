import { Interceptor, InterceptedRequest, InterceptedResponse } from 'ng2-interceptors';
import { Mask } from './util/mask';

export class ServerInterceptor implements Interceptor {
	private mask: any;

	constructor(){
		this.mask = new Mask();
	}

    public interceptBefore(request: InterceptedRequest): InterceptedRequest {
    	this.mask.show();

      	return request; 
    }
    public interceptAfter(response: InterceptedResponse): InterceptedResponse {
    	this.mask.close();

    	let body: any;
    	try{
        	body = response.response.json();
    	}catch(e){
    		body = {};
    		alert('服务器挂了！');
    	}
        if(body.code == 405){
            alert('登录已过期，请重新登录！');
            location.reload();
        }
        // if(body.code == 500) alert('服务器在重启，稍等！');
        return response;
    }

}
