# なつき
Discordチャットから動画の保存を行いMPC-HC BEで再生するBot

# 使い方
1. ./bin に mpc-be64 ( https://ja.osdn.net/projects/sfnet_mpcbe/ ) と youtube-dl ( https://youtube-dl.org/ ) を配置

2. Discord Developer Portalよりアプリケーションを作成し、ボットのTOKENを取得
参考: https://discordpy.readthedocs.io/ja/latest/discord.html#discord-intro

3. index.js最終行の `client.login('');` のTOKENを変更

4. `@botname URL` で実行