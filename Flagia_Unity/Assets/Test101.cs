using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test101 : MonoBehaviour
{
    float move = 0.05f;
    public string PlayerName;
    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("プレーヤー名:" + PlayerName);

    }

    // Update is called once per frame
    void Update()
    {
        Vector3 pos = transform.position;
        pos.x += move;
        transform.position = pos;
    }
}
