$(function(){

	var curText = "";
	var tempNum = new Array();
	var tempOpe = new Array();
	var opeLevel = new Array();
	var i = 0;
	var k = 0;
	var hasShowAns = false;

	//按下數字鍵時的操作
	$(".num").on('click', function()
	{
		
		//畫面上顯示上個答案時按下了數字鍵代表清除
		if(hasShowAns == true)
		{
			tempNum[i] = "";
			curText = "";
			render();
			hasShowAns = false;
		}

		//陣列中新的數值要從未宣告變成空字串
		if(tempNum[i] == undefined)
		{
			tempNum[i] = "";
		}

		//防止在一個數值裡打上兩個以上的小數點
		if(this.id != "." || tempNum[i].indexOf(".") == -1)
		{
			//當按下小數點鍵時字串裡沒有數字會自動補上0
			if(this.id == "." && (tempNum[i] == "" || tempNum[i] == "-") )
			{
				tempNum[i] += "0";
				curText = curText + "0";
			}

			//把陣列裡第i個字串與畫面上都加上輸入的數字
			tempNum[i] += this.id;
			curText = curText + this.id;
			render();
		}
	})

	//按下運算符號鍵時的操作
	$(".ope").on('click', function()
	{

		//畫面上顯示上個答案時按下了運算符號鍵代表繼續計算（把答案當成下個算式的一部份）
		if(hasShowAns == true)
		{
			hasShowAns = false;
		}

		//若按下-鍵時前面是運算符號時代表當成負號來用（數值陣列與符號陣列長度相等代表算式尾端是符號）
		if(this.id == "-" && tempNum.length == tempOpe.length)
		{
			tempNum[i] = "-";
			curText = curText + this.id;
			render();
		}
		else
		{
			//如果目前算式尾端是運算符號就不能再打符號（除了-因為當作負號）
			if(tempNum.length != tempOpe.length && tempNum[i] != "-")
			{
				//判斷運算符號在之後運算時的優先程度
				if(this.id == "+" || this.id == "-")
				{
					opeLevel[i] = 1;
				}
				else
				{
					opeLevel[i] = 2;
				}
				
				
				tempOpe[i] = this.id;
				curText = curText + this.id;
				render();

				//輸入運算符號代表上個數值已輸入完成，因此將指標i指到下一個欄位
				i++;
			}
		}
		
	})

	//按下清除鍵時的操作
	$("#C").on('click', function()
	{
		//將所有陣列、指標、變數清除
		tempNum.length = 0;
		tempOpe.length = 0;
		opeLevel.length = 0;
		i = 0;
		k = 0;
		curText = " ";

		render();
	})

	//按下計算鍵時的操作
	$("#calculate").on('click', function()
	{
		//將字串轉為數值形式
		for(var j=0;j<tempNum.length;j++)
		{
			tempNum[j] = Number(tempNum[j]);
		}

		//呼叫用來計算的函數
		calculator();

		//得到結果後將指標i歸零，記錄下已顯示答案
		i = 0;
		hasShowAns = true; 

		//當運算發生錯誤，最後答案不是數值時提醒Error並清除
		if(isNaN(tempNum[i]) == true)
		{
			alert("Error!");
			tempNum.length = 0;
			tempOpe.length = 0;
			opeLevel.length = 0;
			i = 0;
			k = 0;
			curText = " ";
		}
		else
		{
			curText = tempNum[i];
		}
		render();
	})

	//用來遞迴計算的函數
	function calculator()
	{
		//若運算中的符號是算式中最後面的，則不繼續往下比優先程度
		if(k+1 == tempOpe.length)
		{
			//呼叫單次計算的函數
			calculate();
			//如果現在數值陣列有不止一個值（還沒算出答案）
			if(tempNum.length != 1)
			{
				//將指標k往回移動
				k--;
				//遞迴呼叫自身，繼續計算下個步驟
				calculator();
			}
		}

		//如果現在指標k指到的符號優先程度大於下一個
		if(opeLevel[k] > opeLevel[k+1])
		{
			//呼叫單次計算的函數
			calculate();

			//如果指標現在不在0，代表剛運算完的數值前面還有數值需要被運算
			if(k>0)
			{
				//將指標k往回移動
				k--;
			}

			//如果還有運算符號尚未被運算，就遞迴繼續運算
			if(tempOpe.length != 0)
			{
				calculator();
			}
		}
		//如果現在指標k指到的符號優先程度小於下一個
		else if(opeLevel[k] < opeLevel[k+1])
		{
			//先跳過現在的運算，將指標k往後移動，遞迴去計算優先度大的運算
			k++;
			calculator();

		}
		//如果現在指標k指到的符號優先程度等於下一個
		else
		{
			//呼叫單次計算的函數
			calculate();

			//如果還有運算符號尚未被運算，就遞迴繼續運算
			if(tempOpe.length != 0)
			{
				calculator();
			}
		}
	}

	//用來單次計算的函數
	function calculate()
	{
		//判斷現在指標k指到的符號是什麼，對它前後的數值做出相符的運算
		if(tempOpe[k] == "+")
		{
			tempNum[k] += tempNum[k+1];
		}
		else if(tempOpe[k] == "-")
		{
			tempNum[k] -= tempNum[k+1];
		}
		else if(tempOpe[k] == "×")
		{
			tempNum[k] *= tempNum[k+1];
		}
		else if(tempOpe[k] == "÷")
		{
			tempNum[k] /= tempNum[k+1];
		}

		//將已運算完的數值（右邊的數值）與運算符號和優先度都清除，讓後面的補上來
		tempNum.splice(k+1,1);
		tempOpe.splice(k,1);
		opeLevel.splice(k,1);
	}

	//讓畫面上顯示現在算式的函數
	function render() 
	{
		$('#message').text(curText);
	}

});