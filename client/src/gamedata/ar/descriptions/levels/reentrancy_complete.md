لمنع هجمات إعادة الدخول (re-entrancy) عند نقل الأموال من عقدك، استخدم نمط [الفحص-التأثير-التفاعل](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) مع العلم أن `call` سيُرجع false فقط دون مقاطعة تدفق التنفيذ. يمكن أيضًا استخدام حلول مثل [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) أو [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment).

لا يُنصح باستخدام `transfer` و `send` كحلول بعد الآن، حيث يمكن أن تتسببا في تعطل العقود بعد تحديث "إسطنبول" (Istanbul hard fork). [المصدر 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/)، [المصدر 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

افترض دائماً أن مستلم الأموال التي ترسلها قد يكون عقداً آخر، وليس مجرد عنوان عادي. وبالتالي، يمكنه تنفيذ كود برمجي في دالة الـ `fallback` الخاصة به، وإعادة الدخول إلى عقدك، مما قد يؤدي إلى إفساد بياناتك المسجلة (State) أو منطق العقد.

إعادة الدخول (**Re-entrancy**) هي هجمة شائعة، ويجب عليك دائماً أن تكون مستعداً لها!

&nbsp;
#### اختراق DAO

استخدم اختراق منظمة DAO الشهير تقنية Re-entrancy لسحب كمية ضخمة من الإيثير من العقد الضحية. راجع مقال: [15 سطراً من الكود كانت كفيلة بمنع اختراق TheDAO](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).