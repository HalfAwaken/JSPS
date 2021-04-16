$(function() {
//	location.href = 'appmanager.html'
	var $audioPlay = $("#audio-player");
	getData();
	var timer1 = setInterval(function(){
		getData();
	},300000);
	function getData(){
		$.ajax({
			type:"get",
			url:"http://js.jinshapeison.com/order/findOrderStatus",
			success:function(res){
				console.log(res)
				if(res.code==0&&res.data.order_status==1){
					layui.use('layer', function() {
						var layer = layui.layer;
						$audioPlay[0].play();
						var timer = setInterval(function(){
							$audioPlay[0].play();
						},10000)
						layer.confirm('您有新的订单', function(index) {
							$.ajax({
								type:"post",
								url:"http://js.jinshapeison.com/order/updateOrderInformByBack",
								data:{order_status:'2'},
								success:function(res){
									if(res.code==0){
										clearInterval(timer)
										$audioPlay[0].pause()
										layer.close(index);
									}else{
										layer.msg('请重试')
									}
								}
							});
						},function(index){
							$.ajax({
								type:"post",
								url:"http://js.jinshapeison.com/order/updateOrderInformByBack",
								data:{order_status:'2'},
								success:function(res){
									if(res.code==0){
										clearInterval(timer)
										$audioPlay[0].pause()
									}else{
										layer.msg('请重试')
									}
								}
							});
						});
					})
				}
			}
		});
	}
})