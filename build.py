"""Construye dist/index.html a partir de src/ (CSS + JS en un solo archivo)."""
import os,subprocess
R=os.path.dirname(os.path.abspath(__file__));S=os.path.join(R,'src');D=os.path.join(R,'dist','index.html')
JS=['data.js','engine.js','plan.js','render.js','render2.js','render3.js','render4.js','render5.js','render6.js','tech.js','tech2en.js','tech2.js','render7.js','render8.js','render9.js','render10.js','render11.js','render12.js','render13.js','events.js']
rd=lambda f:open(os.path.join(S,f),encoding='utf8').read()
css=rd('base.css')+'\n'+rd('theme.css')+'\n'+rd('light.css');js='\n'.join(rd(f) for f in JS)
h=open(D,encoding='utf8').read()
a=h.index('<style>')+7;b=h.index('</style>');h=h[:a]+'\n'+css+'\n'+h[b:]
a=h.index('<script>')+8;b=h.index('</script>',a);h=h[:a]+'\n{\n'+js+'\n'+h[b:]
open(D,'w',encoding='utf8').write(h);print('dist/index.html OK')
